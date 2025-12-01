import { Page } from '@playwright/test'
import { expect } from '@playwright/test'

import { MinhaConta } from '@/src/components/navigation/minhaConta/minhaConta'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class ProgramaVip {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async programaVipNavigation(creds: CredenciaisLogin) {
        const minhaConta = new MinhaConta(this.page)
        await minhaConta.minhaContaNavigation(creds)

        await this.page.getByText('Programa VIP').first().click()
        await this.page.waitForTimeout(5000)

        await expect(this.page.getByText('Programa VIP').first()).toBeVisible()
    }
}