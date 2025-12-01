import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class SomPage {
    readonly page: Page
    readonly voltarBotao: Locator
    readonly sonsLink: Locator
    readonly sonsHeading: Locator
    readonly alert: Locator

    constructor(page: Page) {
        this.page = page
        this.alert = this.page.getByRole('alert')
        this.voltarBotao = this.page.getByRole('button', { name: 'voltar' })
        this.sonsLink = this.page.getByRole('link', { name: 'Som Sons do sistema' })
        this.sonsHeading = this.page.getByRole('heading', { name: 'Sons do sistema' })
    }

    async abrirSom(creds: CredenciaisLogin) {
        const navigation = new Configuracoes(this.page)
        await navigation.configuracoesNavigation(creds)
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
    async validarSom(creds: CredenciaisLogin) {
        await this.abrirSom(creds)

        await this.assertVisible(this.voltarBotao)
        await this.sonsLink.click()
        await expect(this.sonsHeading).toBeVisible()
        await this.page.getByText('Ativar sons do sistema:').click()
        await expect(this.alert.filter({ hasText: 'Suas preferências de som' })).toBeVisible({ timeout: 10000 })
    }
}