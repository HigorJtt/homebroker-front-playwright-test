import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes.navigation'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class IdiomaPage {
    readonly page: Page
    readonly voltarBotao: Locator
    readonly salvarBotao: Locator
    readonly comboIdioma: Locator
    readonly alert: Locator

    constructor(page: Page) {
        this.page = page
        this.voltarBotao = this.page.getByRole('button', { name: 'voltar' })
        this.comboIdioma = this.page.getByRole('combobox', { name: 'Selecione o idioma' })
        this.salvarBotao = this.page.getByRole('button', { name: 'Salvar' })
        this.alert = this.page.getByRole('alert')
    }

    async abrirIdioma(creds: CredenciaisLogin) {
        const navigation = new Configuracoes(this.page)
        await navigation.configuracoesNavigation(creds)
    }

    private async assertVisible(...items: Array<string | Locator>) {
        for (const item of items) {
            const locator = typeof item === 'string' ? this.page.getByText(item, { exact: true }) : item
            await expect(locator).toBeVisible()
        }
    }

    async validarIdioma(creds: CredenciaisLogin) {
        await this.abrirIdioma(creds)
        const idiomas = ['PT Português', 'ES Español', 'EN English']

        await this.page.getByText('Alterar sua preferência de idioma').click()
        await this.assertVisible('Alterar idioma', 'Português')
        await this.assertVisible(this.voltarBotao, this.salvarBotao)
        await this.comboIdioma.click()

        for (const idioma of idiomas) {
            await expect(this.page.getByRole('option', { name: idioma })).toBeVisible()
        }

        await this.page.getByRole('option', { name: 'EN English' }).click()
        await this.salvarBotao.click()
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