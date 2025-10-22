import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class ConfiguracoesPage {
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
}