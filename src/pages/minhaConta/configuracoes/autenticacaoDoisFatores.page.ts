import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes.navigation'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class AutenticacaoDoisFatoresPage {
    readonly page: Page
    readonly autenticacaoDoisFatores: Locator
    readonly titulo: Locator
    readonly descricao: Locator
    readonly alert: Locator

    constructor(page: Page) {
        this.page = page
        this.autenticacaoDoisFatores = this.page.getByText('Adicione uma camada extra de proteção à sua conta recebendo um código de verificação.')
        this.titulo = this.page.getByText('Ativar autenticação de dois fatores (2FA)')
        this.descricao = this.page.getByText('A autenticação de dois fatores (2FA) adiciona uma camada extra de segurança à sua conta, exigindo uma segunda etapa de verificação além da sua senha. Isso ajuda a proteger sua conta contra acessos não autorizados, mesmo que sua senha seja comprometida.')
        this.alert = this.page.getByRole('alert')
    }

    async abrirAutenticacaoDoisFatores(creds: CredenciaisLogin) {
        const navigation = new Configuracoes(this.page)
        await navigation.configuracoesNavigation(creds)
    }

    private async assertVisible(...items: Array<string | Locator>) {
        for (const item of items) {
            const locator = typeof item === 'string' ? this.page.getByText(item, { exact: true }) : item
            await expect(locator).toBeVisible()
        }
    }

    async validarAutenticacaoDoisFatores(creds: CredenciaisLogin) {
        await this.abrirAutenticacaoDoisFatores(creds)

        await this.autenticacaoDoisFatores.click()
        await this.assertVisible(this.titulo, this.descricao)
    }
}