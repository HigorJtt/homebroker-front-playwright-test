import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class ProTraderPage {
    readonly page: Page
    readonly btnVoltar: Locator
    readonly lblProTrader: Locator
    readonly imgProTrader: Locator
    readonly btnProTrader: Locator
    readonly selectProTrader: Locator

    constructor(page: Page) {
        this.page = page
        this.btnVoltar = this.page.getByRole('button', { name: 'voltar' })
        this.lblProTrader = this.page.getByText('ProTrader').first()
        this.imgProTrader = this.page.getByRole('img', { name: 'ProTrader', exact: true })
        this.btnProTrader = this.page.getByRole('button', { name: 'ProTrader' })
        this.selectProTrader = this.page.getByLabel('controlled')
    }

    async abrirProTrader(creds: CredenciaisLogin) {
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

    async validarProTrader(creds: CredenciaisLogin) {
        await this.abrirProTrader(creds)

        await this.lblProTrader.click()
        await this.page.waitForTimeout(5000)

        await this.assertVisible(this.btnVoltar)
        await expect(this.lblProTrader).toBeVisible()
        await this.page.getByText('Ativar ou desativar o ProTrader').click()
        await expect(this.imgProTrader).toBeVisible()
        await this.assertVisible('O que você obtém com o ProTrader')
        await expect(this.page.getByText('A visão ProTrader foi projetada para traders prontos para elevar seu nível. Acesse ferramentas, recursos e insights avançados para negociar de forma mais inteligente. Veja a tabela abaixo para comparar a visão Simples e a visão ProTrader.')).toBeVisible()

        if (await this.selectProTrader.isChecked()) {
            await this.imgProTrader.first().isVisible()
            await this.selectProTrader.uncheck()
            await this.btnProTrader.isVisible()
        } else {
            await this.btnProTrader.isVisible()
            await this.selectProTrader.check()
            await this.imgProTrader.first().isVisible()
        }
    }
}