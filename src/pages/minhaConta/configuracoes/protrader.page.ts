import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes.navigation'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class ProTraderPage {
    readonly page: Page
    readonly proTraderTexto: Locator
    readonly proTraderImg: Locator
    readonly proTraderBotao: Locator
    readonly proTraderCheckbox: Locator

    constructor(page: Page) {
        this.page = page
        this.proTraderTexto = this.page.getByText('ProTrader').first()
        this.proTraderImg = this.page.getByRole('img', { name: 'ProTrader', exact: true })
        this.proTraderBotao = this.page.getByRole('button', { name: 'ProTrader' })
        this.proTraderCheckbox = this.page.getByLabel('controlled')
    }

    async abrirProTrader(creds: CredenciaisLogin) {
        const navigation = new Configuracoes(this.page)
        await navigation.configuracoesNavigation(creds)
    }

    private async assertVisible(...items: Array<string | Locator>) {
        for (const item of items) {
            const locator = typeof item === 'string' ? this.page.getByText(item, { exact: true }) : item
            await expect(locator).toBeVisible()
        }
    }

    async validarProTrader(creds: CredenciaisLogin) {
        await this.abrirProTrader(creds)

        await expect(this.proTraderTexto).toBeVisible()
        await this.page.getByText('Ativar ou desativar o ProTrader').click()
        await expect(this.proTraderImg).toBeVisible()
        await this.assertVisible('O que você obtém com o ProTrader')
        await expect(this.page.getByText('A visão ProTrader foi projetada para traders prontos para elevar seu nível. Acesse ferramentas, recursos e insights avançados para negociar de forma mais inteligente. Veja a tabela abaixo para comparar a visão Simples e a visão ProTrader.')).toBeVisible()

        if (await this.proTraderCheckbox.isChecked()) {
            await this.proTraderImg.first().isVisible()
            await this.proTraderCheckbox.uncheck()
            await this.proTraderBotao.isVisible()
        } else {
            await this.proTraderBotao.isVisible()
            await this.proTraderCheckbox.check()
            await this.proTraderImg.first().isVisible()
        }
    }
}