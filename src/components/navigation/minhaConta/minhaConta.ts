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
        this.menuMinhaConta = this.page.getByText('Minha Conta').first()
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

        await this.menuMinhaConta.click()
        await this.page.waitForTimeout(5000)

        await this.assertVisible(
            'Saques',
            'Perfil',
            'Configurações',
            'Visão Geral'
        )
    }
}