import { Page, Locator, expect } from 'playwright/test'

import { CredenciaisLogin } from '@/src/interfaces/login.interface'
import { Login } from '@/src/components/navigation/login/login'

export class LoginPage {
    readonly page: Page
    readonly inpEmail: Locator
    readonly inpSenha: Locator
    readonly bntLoginBotao: Locator
    readonly btnGoogle: Locator
    readonly lnkTermos: Locator
    readonly lblExemploParagrafo: Locator

    constructor(page: Page) {
        this.page = page
        this.inpEmail = this.page.locator('input[type="email"]')
        this.inpSenha = this.page.locator('input[type="password"]')
        this.bntLoginBotao = this.page.getByRole('button', { name: 'Iniciar sessão' })
        this.btnGoogle = this.page.getByRole('button', { name: /Entrar com o Google/i })
        this.lnkTermos = this.page.getByText(/Termos e Condições/i)
        this.lblExemploParagrafo = this.page.getByText(/HomeBroker não está autorizada pela Comissão de Valores Mobiliários/i)
    }

    async abrirLogin(creds?: CredenciaisLogin, url?: string) {
        const target = url ?? '/pt/sign-in'
        const login = new Login(this.page)
        if (creds) {
            await login.navigationLogin(creds)
        }
        await this.page.goto(target)
        await expect(this.page).toHaveTitle('Home Broker')
        await this.page.waitForTimeout(5000)
    }

    private async assertVisible(...items: Array<string | Locator>): Promise<void> {
        for (const item of items) {
            const locator = typeof item === 'string'
                ? this.page.getByText(item, { exact: true }).first()
                : item
            const count = await locator.count()
            if (count === 0) {
                throw new Error(`Elemento não encontrado: ${typeof item === 'string' ? item : locator.toString()}`)
            }
            await expect(locator.first()).toBeVisible({ timeout: 10000 })
        }
    }

    async validarLoginHomebroker() {
        await this.abrirLogin()

        await expect(this.page.getByText('E-mail').first()).toBeVisible()
        await expect(this.page.getByText('Senha').first()).toBeVisible()
        await this.assertVisible(
            'Iniciar sessão',
            'Insira login e senha para acessar sua conta',
        )

        await Promise.all([
            expect(this.inpEmail).toHaveAttribute('placeholder', 'Digite seu e-mail'),
            expect(this.inpSenha).toHaveAttribute('placeholder', 'Digite sua senha')
        ])

        await this.assertVisible(
            this.bntLoginBotao,
            this.btnGoogle,
            'Esqueci minha senha',
            'Criar uma conta agora',
            'Confirmo que tenho pelo menos 18 anos',
            this.lnkTermos,
            'Isenção',
            this.lblExemploParagrafo
        )
    }

    async validarMensagemInformativaEmailSenha() {
        await this.abrirLogin()

        await this.bntLoginBotao.click()
        await this.assertVisible('Digite seu e-mail', 'A senha é obrigatória')
    }

    async validarMensagemInformativaSenhaIncorreta(creds: CredenciaisLogin) {
        const target = '/pt/sign-in'
        await this.page.goto(target)
        await expect(this.page).toHaveTitle('Home Broker')
        await this.page.waitForTimeout(5000)

        await this.inpEmail.fill(creds.email)
        await this.inpSenha.fill(creds.senha)
        await this.bntLoginBotao.click()
        await this.assertVisible('Usuario ou senha incorretos.')
    }
}