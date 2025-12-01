import { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

import { MinhaConta } from '@/src/components/navigation/minhaConta/minhaConta'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class Configuracoes {
    readonly page: Page
    readonly header: Locator

    constructor(page: Page) {
        this.page = page
        this.header = this.page.getByText('Configurações').first()
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

    async configuracoesNavigation(creds: CredenciaisLogin) {
        const minhaConta = new MinhaConta(this.page)
        await minhaConta.minhaContaNavigation(creds)

        await this.header.click()
        await this.page.waitForTimeout(5000)

        await this.assertVisible(this.header)
    }
}