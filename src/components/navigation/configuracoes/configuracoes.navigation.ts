import { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

import { MinhaConta } from '@/src/components/navigation/minhaConta/minhaConta.navigation'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class Configuracoes {
    readonly page: Page
    readonly header: Locator

    constructor(page: Page) {
        this.page = page
        this.header = this.page.getByText('Configurações')
    }

    private async assertVisible(...items: Array<string | Locator>) {
        for (const item of items) {
            const locator = typeof item === 'string' ? this.page.getByText(item, { exact: true }) : item
            await expect(locator).toBeVisible()
        }
    }

    async configuracoesNavigation(creds: CredenciaisLogin) {
        const minhaConta = new MinhaConta(this.page)
        await minhaConta.minhaContaNavigation(creds)

        await this.header.click()
        await this.page.waitForTimeout(5000)

        await this.assertVisible(this.header)
    }
}