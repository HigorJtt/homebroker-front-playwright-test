import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes.navigation'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class DesempenhoPage {
    readonly page: Page
    readonly header: Locator
    readonly preferenciaTexto: Locator
    readonly segurancaTexto: Locator
    readonly legalTexto: Locator
    readonly alert: Locator
    readonly sonsLink: Locator
    readonly sonsHeading: Locator
    readonly desempenho: Locator

    constructor(page: Page) {
        this.page = page
        this.header = this.page.getByText('Configurações')
        this.preferenciaTexto = this.page.getByText('Preferência').first()
        this.segurancaTexto = this.page.getByText('Segurança')
        this.legalTexto = this.page.getByText('Legal')
        this.alert = this.page.getByRole('alert')
        this.sonsLink = this.page.getByRole('link', { name: 'Som Sons do sistema' })
        this.sonsHeading = this.page.getByRole('heading', { name: 'Sons do sistema' })
        this.desempenho = this.page.getByText('Desempenho').first()
    }

    async abrirDesempenho(creds: CredenciaisLogin) {
        const navigation = new Configuracoes(this.page)
        await navigation.configuracoesNavigation(creds)
    }

    async validarDesempenho(creds: CredenciaisLogin) {
        await this.abrirDesempenho(creds)

        await this.desempenho.click()
        await this.page.getByText('Modo Desempenho').isVisible()
        await this.page.getByText('Modo Ativar o modo desempenho melhora a performance do gráfico.').isVisible()
        await this.page.getByText('Ativar modo desempenho:').click()
        await expect(this.alert.filter({ hasText: 'Suas preferências de desempenho foram alteradas com sucesso.' })).toBeVisible({ timeout: 10000 })
        await this.page.waitForTimeout(2000)
        await this.page.getByText('Ativar modo desempenho:').click()
        await expect(this.page.getByRole('alert').filter({ hasText: 'Suas preferências de desempenho foram alteradas com sucesso.' }).locator('div').nth(1)).toBeVisible({ timeout: 10000 })
    }
}