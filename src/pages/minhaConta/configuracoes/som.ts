import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class SomPage {
    readonly page: Page
    readonly btnVoltar: Locator
    readonly lnkSons: Locator
    readonly lnkSonsHeading: Locator
    readonly alert: Locator

    constructor(page: Page) {
        this.page = page
        this.btnVoltar = this.page.getByRole('button', { name: 'voltar' })
        this.lnkSons = this.page.getByRole('link', { name: 'Som Sons do sistema' })
        this.lnkSonsHeading = this.page.getByRole('heading', { name: 'Sons do sistema' })
        this.alert = this.page.getByRole('alert')
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

        await this.assertVisible(this.btnVoltar)
        await this.lnkSons.click()
        await expect(this.lnkSonsHeading).toBeVisible()
        await this.page.getByText('Ativar sons do sistema:').click()
        await expect(this.alert.filter({ hasText: 'Suas preferências de som' })).toBeVisible({ timeout: 10000 })
    }
}