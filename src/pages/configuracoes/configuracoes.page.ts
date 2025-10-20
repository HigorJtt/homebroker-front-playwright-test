import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes.navigation'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class ConfiguracoesPage {
    readonly page: Page
    readonly header: Locator
    readonly preferenciaTexto: Locator
    readonly segurancaTexto: Locator
    readonly legalTexto: Locator
    readonly comboIdioma: Locator
    readonly salvarBotao: Locator
    readonly voltarBotao: Locator
    readonly alert: Locator
    readonly proTraderTexto: Locator
    readonly proTraderImg: Locator
    readonly proTraderBotao: Locator
    readonly proTraderCheckbox: Locator
    readonly sonsLink: Locator
    readonly sonsHeading: Locator

    constructor(page: Page) {
        this.page = page
        this.header = this.page.getByText('Configurações')
        this.preferenciaTexto = this.page.getByText('Preferência').first()
        this.segurancaTexto = this.page.getByText('Segurança')
        this.legalTexto = this.page.getByText('Legal')
        this.comboIdioma = this.page.getByRole('combobox', { name: 'Selecione o idioma' })
        this.salvarBotao = this.page.getByRole('button', { name: 'Salvar' })
        this.voltarBotao = this.page.getByRole('button', { name: 'voltar' })
        this.alert = this.page.getByRole('alert')
        this.proTraderTexto = this.page.getByText('ProTrader').first()
        this.proTraderImg = this.page.getByRole('img', { name: 'ProTrader', exact: true })
        this.proTraderBotao = this.page.getByRole('button', { name: 'ProTrader' })
        this.proTraderCheckbox = this.page.getByLabel('controlled')
        this.sonsLink = this.page.getByRole('link', { name: 'Som Sons do sistema' })
        this.sonsHeading = this.page.getByRole('heading', { name: 'Sons do sistema' })
    }

    async abrirConfiguracoes(creds: CredenciaisLogin) {
        const navigation = new Configuracoes(this.page)
        await navigation.configuracoesNavigation(creds)
    }

    private escapeRegex(str: string) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    private async assertVisible(...items: Array<string | Locator>) {
        for (const item of items) {
            const locator = typeof item === 'string' ? this.page.getByText(item, { exact: true }) : item
            await expect(locator).toBeVisible()
        }
    }

    async validarConfiguracoes(creds: CredenciaisLogin) {
        await this.abrirConfiguracoes(creds)

        await this.assertVisible(
            this.header,
            this.preferenciaTexto,
            this.segurancaTexto,
            this.legalTexto
        )

        const opcoesConfiguracao = [
            {
                title: 'Idioma',
                description: 'Alterar sua preferência de idioma'
            },
            {
                title: 'ProTrader',
                description: 'Ativar ou desativar o ProTrader'
            },
            {
                title: 'Som',
                description: 'Sons do sistema'
            },
            {
                title: 'Desempenho',
                description: 'Desempenho do gráfico'
            },
            {
                title: 'Alterar sua senha',
                description: 'Se você notar alguma atividade suspeita, recomendamos alterar sua senha'
            },
            {
                title: 'Autenticação de dois fatores (2FA)',
                description: 'Adicione uma camada extra de proteção à sua conta recebendo um código de verificação.'
            },
            {
                title: 'Termos e condições',
                description: 'Política de privacidade'
            }
        ]

        for (const opcao of opcoesConfiguracao) {
            await expect(this.page.getByText(new RegExp(`^${this.escapeRegex(opcao.title)}$`, 'i'))).toBeVisible()
            await expect(this.page.getByText(new RegExp(`^${this.escapeRegex(opcao.description)}$`, 'i'))).toBeVisible()
        }
    }

    async validarIdioma(creds: CredenciaisLogin) {
        await this.abrirConfiguracoes(creds)

        await this.page.getByText('Alterar sua preferência de idioma').click()

        await this.assertVisible('Alterar idioma', 'Português')
        await this.assertVisible(this.voltarBotao, this.salvarBotao)

        const idiomas = ['PT Português', 'ES Español', 'EN English']
        await this.comboIdioma.click()

        for (const idioma of idiomas) {
            await expect(this.page.getByRole('option', { name: idioma })).toBeVisible()
        }

        await this.page.getByRole('option', { name: 'EN English' }).click()
        await this.salvarBotao.click()
        await expect(this.alert.filter({ hasText: 'Seu idioma foi alterado com sucesso.' })).toBeVisible()
        await this.page.waitForTimeout(3000)

        await this.assertVisible('Change language', 'English')
        await this.page.getByRole('button', { name: 'Save' }).click()

        await this.page.getByRole('combobox', { name: 'Select your language' }).click()

        for (const idioma of idiomas) {
            await expect(this.page.getByRole('option', { name: idioma })).toBeVisible()
        }

        await this.page.getByRole('option', { name: 'Português' }).click()
        await expect(this.alert.filter({ hasText: 'Your language was saved.' })).toBeVisible({ timeout: 10000 })
    }

    async validarProTrader(creds: CredenciaisLogin) {
        await this.abrirConfiguracoes(creds)

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

    async validaSons(creds: CredenciaisLogin) {
        await this.abrirConfiguracoes(creds)

        await this.sonsLink.click()
        await expect(this.sonsHeading).toBeVisible()
        await this.page.getByText('Ativar sons do sistema:').click()
        await expect(this.alert.filter({ hasText: 'Suas preferências de som' }).locator('div').nth(1)).toBeVisible()
        await this.page.getByRole('link', { name: 'Voltar' }).click()
    }
}