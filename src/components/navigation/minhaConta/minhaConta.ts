import { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

import { Login } from '@/src/components/navigation/login/login'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class MinhaConta {
    readonly page: Page
    readonly menuMinhaConta: Locator
    readonly secaoSaques: Locator
    readonly secaoPerfil: Locator
    readonly secaoConfiguracoes: Locator
    readonly secaoVisaoGeral: Locator
    readonly programaVip: Locator

    constructor(page: Page) {
        this.page = page
        this.menuMinhaConta = this.page.getByText('Minha conta')
        this.secaoSaques = this.page.getByText('Saques')
        this.secaoPerfil = this.page.getByText('Perfil')
        this.secaoConfiguracoes = this.page.getByText('Configurações')
        this.secaoVisaoGeral = this.page.getByText('Visão Geral')
        this.programaVip = this.page.getByText('Vantagens e bônus especiais')
    }

    private async assertVisible(...items: Array<string | Locator>) {
        for (const item of items) {
            const locator = typeof item === 'string' ? this.page.getByText(item, { exact: true }) : item
            await expect(locator).toBeVisible()
        }
    }

    async minhaContaNavigation(creds: CredenciaisLogin) {
        const login = new Login(this.page)
        await login.navigationLogin(creds)

        await this.page.waitForTimeout(5000)
        if (await this.programaVip.isVisible()) {
            this.page.getByText('Não mostrar novamente').click()
        }
        await this.menuMinhaConta.click()
        await this.page.waitForTimeout(5000)

        await this.assertVisible(
            this.secaoSaques,
            this.secaoPerfil,
            this.secaoConfiguracoes,
            this.secaoVisaoGeral
        )
    }
}