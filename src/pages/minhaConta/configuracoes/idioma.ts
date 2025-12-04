import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class IdiomaPage {
    readonly page: Page
    readonly btnVoltar: Locator
    readonly selectIdioma: Locator
    readonly btnSalvar: Locator
    readonly alert: Locator

    constructor(page: Page) {
        this.page = page
        this.btnVoltar = this.page.getByRole('button', { name: 'voltar' })
        this.selectIdioma = this.page.getByRole('combobox', { name: 'Selecione o idioma' })
        this.btnSalvar = this.page.getByRole('button', { name: 'Salvar' })
        this.alert = this.page.getByRole('alert')
    }

    async abrirIdioma(creds: CredenciaisLogin) {
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

    async validarIdioma(creds: CredenciaisLogin) {
        await this.abrirIdioma(creds)
        const idiomas = ['PT Português', 'ES Español', 'EN English']

        await this.page.getByText('Alterar sua preferência de idioma').click()
        await this.assertVisible('Alterar idioma', 'Português')
        await this.assertVisible(this.btnVoltar, this.btnSalvar)
        await this.selectIdioma.click()

        for (const idioma of idiomas) {
            await expect(this.page.getByRole('option', { name: idioma })).toBeVisible()
        }

        await this.page.getByRole('option', { name: 'EN English' }).click()
        await this.btnSalvar.click()
        await this.page.waitForTimeout(1000)
        await expect(this.alert.filter({ hasText: 'Seu idioma foi alterado com sucesso.' })).toBeVisible({ timeout: 10000 })
        await this.assertVisible('Change language', 'English')
        await this.page.getByRole('combobox', { name: 'Select your language' }).click()

        for (const idioma of idiomas) {
            await expect(this.page.getByRole('option', { name: idioma })).toBeVisible()
        }

        await this.page.getByRole('option', { name: 'Português' }).click()
        await this.page.getByRole('button', { name: 'Save' }).click()
        await expect(this.alert.filter({ hasText: 'Your language was saved.' }).first()).toBeVisible({ timeout: 10000 })
    }
}