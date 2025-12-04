import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class DesempenhoPage {
    readonly page: Page
    readonly lblDesempenho: Locator
    readonly btnVoltar: Locator
    readonly alert: Locator

    constructor(page: Page) {
        this.page = page
        this.lblDesempenho = this.page.getByText('Desempenho').first()
        this.btnVoltar = this.page.getByRole('button', { name: 'voltar' })
        this.alert = this.page.getByRole('alert')
    }

    async abrirDesempenho(creds: CredenciaisLogin) {
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

    async validarDesempenho(creds: CredenciaisLogin) {
        await this.abrirDesempenho(creds)

        await this.lblDesempenho.click()
        await this.page.waitForTimeout(5000)

        await this.assertVisible(
            'Modo Desempenho',
            'Ativar o modo desempenho melhora a performance do gráfico.',
            this.btnVoltar
        )

        await this.page.getByText('Ativar modo desempenho:').click()
        await expect(this.alert.filter({ hasText: 'Suas preferências de desempenho foram alteradas com sucesso.' })).toBeVisible({ timeout: 10000 })
        await this.page.waitForTimeout(2000)
        await this.page.getByText('Ativar modo desempenho:').click()
        await expect(this.page.getByRole('alert').filter({ hasText: 'Suas preferências de desempenho foram alteradas com sucesso.' }).locator('div').nth(1)).toBeVisible({ timeout: 10000 })
    }
}