import { Page } from '@playwright/test'
import { expect } from '@playwright/test'

import { MinhaConta } from '@/src/components/navigation/minhaConta/minhaConta'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class Perfil {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async perfilNavigation(creds: CredenciaisLogin) {
        const minhaConta = new MinhaConta(this.page)
        await minhaConta.minhaContaNavigation(creds)

        await this.page.getByText('Perfil').click()
        await this.page.waitForTimeout(5000)

        await expect(this.page.getByText('Informação do perfil')).toBeVisible()
    }
}