import { Page, Locator, expect } from '@playwright/test'

import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class CadastrarPage {
    readonly page: Page
    readonly inpEmail: Locator
    readonly inpSenha: Locator
    readonly inpTelefone: Locator
    readonly btnCadastrar: Locator
    readonly btnGoogle: Locator
    readonly lnkTermos: Locator
    readonly exemploParagrafo: Locator

    constructor(page: Page) {
        this.page = page
        this.inpEmail = this.page.locator('input[type="email"]')
        this.inpSenha = this.page.locator('input[type="password"]')
        this.inpTelefone = this.page.locator('input[type="tel"]')
        this.btnCadastrar = this.page.getByRole('button', { name: 'Cadastrar' })
        this.btnGoogle = this.page.getByRole('button', { name: /Registrar com o Google/i })
        this.lnkTermos = this.page.getByText(/Termos e Condições/i)
        this.exemploParagrafo = this.page.getByText(/HomeBroker não está autorizada pela Comissão de Valores Mobiliários/i)
    }

    async abrirCadastrar() {
        await this.page.goto('/pt/register')
        await expect(this.page.getByText('Cadastrar').first()).toBeVisible()
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

    async validarCadastrar() {
        await this.abrirCadastrar()

        await this.assertVisible(
            'E-mail',
            'Senha'
        )

        await Promise.all([
            expect(this.inpEmail).toHaveAttribute('placeholder', 'Email'),
            expect(this.inpSenha).toHaveAttribute('placeholder', 'Digite sua senha')
        ])
        await this.assertVisible(
            'Crie sua conta gratuita e comece a negociar',
            'Número de telefone',
            'País',
            'Confirmo que tenho pelo menos 18 anos',
            this.btnGoogle,
            this.lnkTermos,
            'Isenção',
            this.exemploParagrafo
        )
    }

    async validarMensagensInformativas() {
        await this.abrirCadastrar()

        await this.btnCadastrar.click()
        await this.assertVisible('Digite seu e-mail', 'Pelo menos 8 caracteres', 'Você precisa inserir seu número de telefone')
    }

    async validarMensagemInformativaTelefoneExistente(creds: CredenciaisLogin) {
        await this.abrirCadastrar()

        await this.btnCadastrar.click()
        await this.inpEmail.fill(creds.email)
        await this.inpSenha.fill(creds.senha)
        await this.inpTelefone.fill(creds.numero)
        await this.btnCadastrar.click()
        await expect(this.page.getByText('O número de telefone 5561999456435 já existe').first()).toBeVisible()
    }

    async validarMensagemInformativaEmailExistente(creds: CredenciaisLogin) {
        await this.abrirCadastrar()

        await this.inpEmail.fill(creds.email)
        await this.inpSenha.fill(creds.senha)
        await this.inpTelefone.fill(creds.numero)
        await this.btnCadastrar.click()
        await expect(this.page.getByText('Já existe uma conta com o e-mail fornecido.').first()).toBeVisible()
    }
}