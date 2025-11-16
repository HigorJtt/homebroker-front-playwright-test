import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class ConfiguracoesPage {
    readonly page: Page
    readonly voltarBotao: Locator
    readonly preferenciaTexto: Locator
    readonly desempenho: Locator

    constructor(page: Page) {
        this.page = page
        this.voltarBotao = this.page.getByRole('button', { name: 'voltar' })
        this.preferenciaTexto = this.page.getByText('Preferência').first()
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
            'Configurações',
            'Segurança',
            'Legal',
            this.voltarBotao
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