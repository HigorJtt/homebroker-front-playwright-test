import { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

import { MinhaConta } from '@/src/components/navigation/minhaConta/minhaConta'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class Saque {
    readonly page: Page
    readonly saqueMinhaContaTexto: Locator
    readonly saqueTitulo: Locator
    readonly saqueDescricao: Locator

    constructor(page: Page) {
        this.page = page
        this.saqueMinhaContaTexto = this.page.getByText('Saques', { exact: true })
        this.saqueTitulo = this.page.getByText('Saque', { exact: true })
        this.saqueDescricao = this.page.getByText('Escolha como quer fazer seu saque', { exact: true })
    }

    async saqueNavigation(creds: CredenciaisLogin) {
        const minhaConta = new MinhaConta(this.page)
        await minhaConta.minhaContaNavigation(creds)

        await this.saqueMinhaContaTexto.click()

        await expect(this.saqueTitulo).toBeVisible()
        await expect(this.saqueDescricao).toBeVisible()
    }
}