import { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class Login {
    readonly page: Page
    readonly emailInput: Locator
    readonly passwordInput: Locator
    readonly loginButton: Locator
    readonly verificationHeading: Locator
    readonly verificationInput: Locator
    readonly verifyButton: Locator
    readonly onboardingTitulo: Locator

    constructor(page: Page) {
        this.page = page
        this.emailInput = this.page.getByPlaceholder('Digite seu e-mail')
        this.passwordInput = this.page.getByPlaceholder('Digite sua senha')
        this.loginButton = this.page.getByRole('button', { name: 'Iniciar sessão' })
        this.verificationHeading = this.page.getByRole('heading', { name: 'Digite o código de verificação' })
        this.verificationInput = this.page.locator('input')
        this.verifyButton = this.page.getByRole('button', { name: 'Verificar código' })
        this.onboardingTitulo = this.page.getByText('Bem-vindo à HomeBroker')
    }

    async abrir() {
        await this.page.goto('https://homebroker-hml.homebroker.com/pt/sign-in')
        await expect(this.page).toHaveTitle('Home Broker')
    }

    async navigationLogin(creds: CredenciaisLogin) {
        await this.abrir()

        await this.emailInput.fill(creds.email)
        await this.passwordInput.fill(creds.senha)

        await this.loginButton.click()
        await this.page.waitForTimeout(5000)

        if (await this.verificationHeading.isVisible()) {
            await this.verificationInput.fill('000001')
            await this.verifyButton.click()
        }

        await this.page.waitForURL('**/pt/invest', { timeout: 10000 })

        if (await this.onboardingTitulo.isVisible()) {
            await this.page.getByTestId('CloseIcon').click()
        }
    }
}