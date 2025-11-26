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
    readonly programaVip: Locator
    readonly bonus: Locator
    readonly blackFriday: Locator

    constructor(page: Page) {
        this.page = page
        this.emailInput = this.page.getByPlaceholder('Digite seu e-mail')
        this.passwordInput = this.page.getByPlaceholder('Digite sua senha')
        this.loginButton = this.page.getByRole('button', { name: 'Iniciar sessão' })
        this.verificationHeading = this.page.getByRole('heading', { name: 'Digite o código de verificação' })
        this.verificationInput = this.page.locator('input')
        this.verifyButton = this.page.getByRole('button', { name: 'Verificar código' })
        this.onboardingTitulo = this.page.getByText('Bem-vindo à HomeBroker')
        this.programaVip = this.page.getByText('Vantagens e bônus especiais')
        this.bonus = this.page.getByText('Comece com tudo e com saldo turbinado')
        this.blackFriday = this.page.getByText('🔥 Black Week HomeBroker 🔥', { exact: true })
    }

    async abrir() {
        await this.page.goto('/pt/sign-in')
        await expect(this.page).toHaveURL('/pt/sign-in')
    }

    private async fecharModaisOpcionais() {
        const modais = [
            {
                nome: 'Black Friday',
                verificador: this.blackFriday,
                botao: () => this.page.locator('[data-slot="dialog-close"]').first()
            },
            {
                nome: 'Onboarding',
                verificador: this.onboardingTitulo,
                botao: () => this.page.getByTestId('CloseIcon')
            },
            {
                nome: 'Programa VIP',
                verificador: this.programaVip,
                botao: () => this.page.getByText('Não mostrar novamente', { exact: false }).first()
            },
            {
                nome: 'Black Friday',
                verificador: this.blackFriday,
                botao: () => this.page.locator('[data-slot="dialog-close"]').first()
            },
            {
                nome: 'Bônus',
                verificador: this.bonus,
                botao: () => this.page.getByText('Garanta seu bônus hoje mesmo! 🚀', { exact: true }).first()
            }
        ]

        for (const modal of modais) {
            try {
                const modalVisivel = await modal.verificador.isVisible({ timeout: 2000 })
                if (modalVisivel) {
                    const botao = modal.botao()
                    const botaoVisivel = await botao.isVisible({ timeout: 2000 })

                    if (botaoVisivel) {
                        await botao.click({ timeout: 3000 })
                        await this.page.waitForTimeout(500)
                    }
                }
            } catch (error) {
                console.error(`Erro ao fechar modal ${modal.nome}:`, error)
            }
        }
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
        await this.page.waitForTimeout(5000)

        await this.fecharModaisOpcionais()
    }
}