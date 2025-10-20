import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes.navigation'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class ConfiguracoesPage {
    readonly page: Page
    readonly header: Locator
    readonly alterarSenha: Locator

    constructor(page: Page) {
        this.page = page
        this.header = this.page.getByText('Alterar sua senha')
        this.alterarSenha = this.page.getByText('Alterar senha').first()

    }

    async abrirAlterarSenha(creds: CredenciaisLogin) {
        const navigation = new Configuracoes(this.page)
        await navigation.configuracoesNavigation(creds)
    }

    async validarConfiguracoes(creds: CredenciaisLogin) {
        await this.abrirAlterarSenha(creds)

        await this.alterarSenha.click()

    }
}