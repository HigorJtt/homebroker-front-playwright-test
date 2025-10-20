import { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

import { CredenciaisLogin } from '@/src/interfaces/login.interface'
import { Login } from '@/src/components/navigation/login/login.navigation'

export class CadastrarPage {
    readonly page: Page
    readonly cadastreseBotao: Locator
    readonly descricao: Locator
    readonly numeroTelefone: Locator
    readonly telefoneInput: Locator
    readonly countryCodeHidden: Locator
    readonly countryButton: Locator
    readonly pais: Locator
    readonly confirmarIdadeTexto: Locator
    readonly termosLink: Locator
    readonly exemptionTitle: Locator
    readonly exemploParagrafo: Locator
    readonly cadastrarBotao: Locator
    readonly googleBotao: Locator
    readonly email: Locator
    readonly senha: Locator

    constructor(page: Page) {
        this.page = page
        this.cadastreseBotao = this.page.getByRole('button', { name: 'Cadastre-se' })
        this.descricao = this.page.getByText('Crie sua conta gratuita e comece a negociar')
        this.email = this.page.locator('input[type="email"], input[name="email"]')
        this.senha = this.page.locator('input[type="password"], input[name="password"]')
        this.numeroTelefone = this.page.getByText('Número de telefone')
        this.telefoneInput = this.page.locator('input[type="tel"]')
        this.pais = this.page.getByText('País')
        this.confirmarIdadeTexto = this.page.getByText('Confirmo que tenho pelo menos 18 anos')
        this.cadastrarBotao = this.page.getByRole('button', { name: 'Cadastrar' })
        this.googleBotao = this.page.getByRole('button', { name: /Registrar com o Google/i })
        this.termosLink = this.page.getByText(/Termos e Condições/i)
        this.exemptionTitle = this.page.getByText('Isenção')
        this.exemploParagrafo = this.page.getByText(/HomeBroker não está autorizada pela Comissão de Valores Mobiliários/i)
    }

    async abrirCadastrar(creds?: CredenciaisLogin) {
        const login = new Login(this.page)

        await this.page.goto('https://homebroker-hml.homebroker.com/pt/sign-in')
        await expect(this.page).toHaveTitle('Home Broker')
        await login.navigationLogin(creds)
        await this.cadastreseBotao.click()
        await this.page.waitForTimeout(5000)
    }

    private async assertVisible(...items: Array<string | Locator>) {
        for (const item of items) {
            const locator = typeof item === 'string' ? this.page.getByText(item, { exact: true }) : item
            await expect(locator).toBeVisible()
        }
    }

    async validarCadastrar() {
        await this.abrirCadastrar()

        await expect(this.page.getByText('Cadastrar').first()).toBeVisible()
        await expect(this.page.getByText('E-mail').first()).toBeVisible()
        await expect(this.page.getByText('Senha').first()).toBeVisible()

        await Promise.all([
            expect(this.email).toHaveAttribute('placeholder', 'Email'),
            expect(this.senha).toHaveAttribute('placeholder', 'Digite sua senha')
        ])
        await this.assertVisible(
            this.descricao,
            this.numeroTelefone,
            this.pais,
            this.confirmarIdadeTexto,
            this.googleBotao,
            this.termosLink,
            this.exemptionTitle,
            this.exemploParagrafo
        )
    }

    async validarMensagensInformativas() {
        await this.abrirCadastrar()

        await this.cadastrarBotao.click()
        await this.assertVisible('Digite seu e-mail', 'Pelo menos 8 caracteres', 'Você precisa inserir seu número de telefone')
    }

    async validarMensagemInformativaTelefoneExistente(creds: CredenciaisLogin) {
        await this.abrirCadastrar()

        await this.cadastrarBotao.click()
        await this.email.fill(creds.email)
        await this.senha.fill(creds.senha)
        await this.telefoneInput.fill(creds.numero)
        await this.cadastrarBotao.click()
        await this.assertVisible('O número de telefone 61999456435 já está existe')
    }

    async validarMensagemInformativaSenhaIncorreta(creds: CredenciaisLogin) {
        await this.abrirCadastrar(creds)

        await this.email.fill(creds.email)
        await this.senha.fill(creds.senha)
        await this.cadastrarBotao.click()
        await this.assertVisible('Email e/ou senha incorreto')
    }
}