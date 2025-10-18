import { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

export class Login {
    readonly page: Page
    readonly emailInput: Locator
    readonly passwordInput: Locator
    readonly loginButton: Locator
    readonly verificationHeading: Locator
    readonly verificationInput: Locator
    readonly verifyButton: Locator

    constructor(page: Page) {
        this.page = page
        this.emailInput = this.page.getByPlaceholder('Digite seu e-mail')
        this.passwordInput = this.page.getByPlaceholder('Digite sua senha')
        this.loginButton = this.page.getByRole('button', { name: 'Iniciar sessão' })
        this.verificationHeading = this.page.getByRole('heading', { name: 'Digite o código de verificação' })
        this.verificationInput = this.page.locator('input')
        this.verifyButton = this.page.getByRole('button', { name: 'Verificar código' })
    }

    async abrir() {
        await this.page.goto('https://homebroker-hml.homebroker.com/pt/sign-in')
        await expect(this.page).toHaveTitle('Home Broker')
        return this
    }

    async navigationLogin(email: string, senha: string) {
        await this.abrir()

        await this.emailInput.fill(email)
        await this.passwordInput.fill(senha)

        await this.loginButton.click()

        if (await this.verificationHeading.isVisible()) {
            await this.verificationInput.fill('000001')
            await this.verifyButton.click()
        }

        await this.page.waitForURL('**/pt/invest', { timeout: 10000 })
        return this
    }
}