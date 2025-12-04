import { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

import { MinhaConta } from '@/src/components/navigation/minhaConta/minhaConta'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class Saque {
    readonly page: Page
    readonly lblSaqueMinhaConta: Locator
    readonly lblSaqueTitulo: Locator
    readonly lblSaqueDescricao: Locator

    constructor(page: Page) {
        this.page = page
        this.lblSaqueMinhaConta = this.page.getByText('Saques', { exact: true })
        this.lblSaqueTitulo = this.page.getByText('Saque', { exact: true })
        this.lblSaqueDescricao = this.page.getByText('Escolha como quer fazer seu saque', { exact: true })
    }

    async saqueNavigation(creds: CredenciaisLogin) {
        const minhaConta = new MinhaConta(this.page)
        await minhaConta.minhaContaNavigation(creds)

        await this.lblSaqueMinhaConta.click()

        await expect(this.lblSaqueTitulo).toBeVisible()
        await expect(this.lblSaqueDescricao).toBeVisible()
    }
}