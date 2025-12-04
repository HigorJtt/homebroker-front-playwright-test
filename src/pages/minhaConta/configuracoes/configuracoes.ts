import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class ConfiguracoesPage {
    readonly page: Page
    readonly btnVoltar: Locator

    constructor(page: Page) {
        this.page = page
        this.btnVoltar = this.page.getByRole('button', { name: 'voltar' })
    }

    async abrirConfiguracoes(creds: CredenciaisLogin) {
        const navigation = new Configuracoes(this.page)
        await navigation.configuracoesNavigation(creds)
    }

    private escapeRegex(str: string) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
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

    async validarConfiguracoes(creds: CredenciaisLogin) {
        await this.abrirConfiguracoes(creds)

        await this.assertVisible(
            'Configurações',
            'Segurança',
            'Legal',
            this.btnVoltar
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