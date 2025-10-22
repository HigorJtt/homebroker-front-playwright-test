import { expect } from '@playwright/test'
import { Page, Locator } from 'playwright'

import { CredenciaisLogin } from '@/src/interfaces/login.interface'
import { Login } from '@/src/components/navigation/login/login'

export class LoginPage {
    readonly page: Page
    readonly email: Locator
    readonly senha: Locator
    readonly forgotPassword: Locator
    readonly titulo: Locator
    readonly descricao: Locator
    readonly loginBotao: Locator
    readonly googleBotao: Locator
    readonly criarContaLink: Locator
    readonly confirmarIdadeTexto: Locator
    readonly termosLink: Locator
    readonly exemptionTitle: Locator
    readonly exemploParagrafo: Locator

    constructor(page: Page) {
        this.page = page
        this.email = this.page.locator('input[type="email"]')
        this.senha = this.page.locator('input[type="password"]')
        this.forgotPassword = this.page.getByText('Esqueci minha senha')
        this.titulo = this.page.getByText('Iniciar sessão').first()
        this.descricao = this.page.getByText('Insira login e senha para acessar sua conta')
        this.loginBotao = this.page.getByRole('button', { name: 'Iniciar sessão' })
        this.googleBotao = this.page.getByRole('button', { name: /Entrar com o Google/i })
        this.criarContaLink = this.page.getByText('Criar uma conta agora')
        this.confirmarIdadeTexto = this.page.getByText('Confirmo que tenho pelo menos 18 anos')
        this.termosLink = this.page.getByText(/Termos e Condições/i)
        this.exemptionTitle = this.page.getByText('Isenção')
        this.exemploParagrafo = this.page.getByText(/HomeBroker não está autorizada pela Comissão de Valores Mobiliários/i)
    }

    async abrirLogin(creds?: CredenciaisLogin, url?: string) {
        const target = url ?? 'https://homebroker-hml.homebroker.com/pt/sign-in'
        const login = new Login(this.page)
        if (creds) {
            await login.navigationLogin(creds)
        }
        await this.page.goto(target)
        await expect(this.page).toHaveTitle('Home Broker')
        await this.page.waitForTimeout(5000)
    }

    private async assertVisible(...items: Array<string | Locator>) {
        for (const item of items) {
            const locator = typeof item === 'string' ? this.page.getByText(item, { exact: true }) : item
            await expect(locator).toBeVisible()
        }
    }

    async validarLoginHomebroker() {
        await this.abrirLogin()

        await expect(this.page.getByText('E-mail').first()).toBeVisible()
        await expect(this.page.getByText('Senha').first()).toBeVisible()
        await this.assertVisible(this.titulo, this.descricao)

        await Promise.all([
            expect(this.email).toHaveAttribute('placeholder', 'Digite seu e-mail'),
            expect(this.senha).toHaveAttribute('placeholder', 'Digite sua senha')
        ])

        await this.assertVisible(
            this.loginBotao,
            this.googleBotao,
            this.forgotPassword,
            this.criarContaLink,
            this.confirmarIdadeTexto,
            this.termosLink,
            this.exemptionTitle,
            this.exemploParagrafo
        )
    }

    async validarMensagemInformativaEmailSenha() {
        await this.abrirLogin()

        await this.loginBotao.click()
        await this.assertVisible('Digite seu e-mail', 'A senha é obrigatória')
    }

    async validarMensagemInformativaSenhaIncorreta(creds: CredenciaisLogin) {
        const target = 'https://homebroker-hml.homebroker.com/pt/sign-in'
        await this.page.goto(target)
        await expect(this.page).toHaveTitle('Home Broker')
        await this.page.waitForTimeout(5000)

        await this.email.fill(creds.email)
        await this.senha.fill(creds.senha)
        await this.loginBotao.click()
        await this.assertVisible('Email e/ou senha incorreto')
    }
}