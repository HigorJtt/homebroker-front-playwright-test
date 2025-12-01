import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class AutenticacaoDoisFatoresPage {
    readonly page: Page
    readonly autenticacaoDoisFatores: Locator
    readonly voltarBotao: Locator

    constructor(page: Page) {
        this.page = page
        this.autenticacaoDoisFatores = this.page.getByText('Adicione uma camada extra de proteção à sua conta recebendo um código de verificação.')
        this.voltarBotao = this.page.getByRole('button', { name: 'voltar' })
    }

    async abrirAutenticacaoDoisFatores(creds: CredenciaisLogin) {
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

    async validarAutenticacaoDoisFatores(creds: CredenciaisLogin) {
        await this.abrirAutenticacaoDoisFatores(creds)

        await this.autenticacaoDoisFatores.click()
        await this.assertVisible(
            'Ativar autenticação de dois fatores (2FA)',
            'A autenticação de dois fatores (2FA) adiciona uma camada extra de segurança à sua conta, exigindo uma segunda etapa de verificação além da sua senha. Isso ajuda a proteger sua conta contra acessos não autorizados, mesmo que sua senha seja comprometida.',
            this.voltarBotao
        )
    }
}