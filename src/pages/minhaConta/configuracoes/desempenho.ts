import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class DesempenhoPage {
    readonly page: Page
    readonly voltarBotao: Locator
    readonly alert: Locator
    readonly desempenho: Locator

    constructor(page: Page) {
        this.page = page
        this.desempenho = this.page.getByText('Desempenho').first()
        this.voltarBotao = this.page.getByRole('button', { name: 'voltar' })
        this.alert = this.page.getByRole('alert')
    }

    async abrirDesempenho(creds: CredenciaisLogin) {
        const navigation = new Configuracoes(this.page)
        await navigation.configuracoesNavigation(creds)
    }

    private async assertVisible(...items: Array<string | Locator>) {
        for (const item of items) {
            const locator = typeof item === 'string' ? this.page.getByText(item, { exact: true }) : item
            await expect(locator).toBeVisible()
        }
    }

    async validarDesempenho(creds: CredenciaisLogin) {
        await this.abrirDesempenho(creds)

        this.assertVisible(
            'Modo Desempenho',
            'Ativar o modo desempenho melhora a performance do gráfico.',
        )
        await this.desempenho.click()
        await this.page.getByText('Ativar modo desempenho:').click()
        await expect(this.alert.filter({ hasText: 'Suas preferências de desempenho foram alteradas com sucesso.' })).toBeVisible({ timeout: 10000 })
        await this.page.waitForTimeout(2000)
        await this.page.getByText('Ativar modo desempenho:').click()
        await expect(this.page.getByRole('alert').filter({ hasText: 'Suas preferências de desempenho foram alteradas com sucesso.' }).locator('div').nth(1)).toBeVisible({ timeout: 10000 })
    }
}