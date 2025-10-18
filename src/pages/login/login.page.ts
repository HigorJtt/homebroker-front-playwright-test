import { expect } from '@playwright/test'
import { Page, Locator } from 'playwright'

export class LoginPage {
    readonly page: Page
    readonly email: Locator
    readonly password: Locator
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
        this.email = this.page.locator('input[type="email"], input[name="email"]')
        this.password = this.page.locator('input[type="password"], input[name="password"]')
        this.forgotPassword = this.page.getByText('Esqueci minha senha')
        this.titulo = this.page.getByText('Iniciar sessão')
        this.descricao = this.page.getByText('Insira login e senha para acessar sua conta')
        this.loginBotao = this.page.getByRole('button', { name: 'Iniciar sessão' })
        this.googleBotao = this.page.getByRole('button', { name: /Entrar com o Google/i })
        this.criarContaLink = this.page.getByText('Criar uma conta agora')
        this.confirmarIdadeTexto = this.page.getByText('Confirmo que tenho pelo menos 18 anos')
        this.termosLink = this.page.getByText(/Termos e Condições/i)
        this.exemptionTitle = this.page.getByText('Isenção')
        this.exemploParagrafo = this.page.getByText(/HomeBroker não está autorizada pela Comissão de Valores Mobiliários/i)
    }

    async abrir(url?: string) {
        const target = url ?? 'https://homebroker-hml.homebroker.com/pt/sign-in'
        await this.page.goto(target)
        await expect(this.page).toHaveTitle('Home Broker')
    }

    // helper para validar múltiplos locators/strings
    private async assertVisible(...items: Array<string | Locator>) {
        for (const item of items) {
            const locator = typeof item === 'string' ? this.page.getByText(item, { exact: true }) : item
            await expect(locator).toBeVisible()
        }
    }

    async validarLoginHomebroker() {

        await this.abrir()

        await this.assertVisible(this.titulo, this.descricao)
        await expect(this.page.getByText('E-mail').first()).toBeVisible()
        await expect(this.page.getByText('Senha').first()).toBeVisible()

        await Promise.all([
            expect(this.email).toHaveAttribute('placeholder', 'Digite seu e-mail'),
            expect(this.password).toHaveAttribute('placeholder', 'Digite sua senha')
        ])

        await this.assertVisible(this.loginBotao, this.googleBotao, this.forgotPassword, this.criarContaLink,
            this.confirmarIdadeTexto, this.termosLink, this.exemptionTitle, this.exemploParagrafo)
    }

    async validarMensagemInformativaEmailSenha() {

        await this.abrir()

        await this.loginBotao.click()
        await this.assertVisible('Digite seu e-mail', 'A senha é obrigatória')
        return this
    }
}