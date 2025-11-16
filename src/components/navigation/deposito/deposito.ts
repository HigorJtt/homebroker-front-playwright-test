import { Page, Locator } from '@playwright/test'

import { Login } from '@/src/components/navigation/login/login'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class Deposito {
    readonly page: Page
    readonly menuDeposito: Locator
    readonly programaVip: Locator

    constructor(page: Page) {
        this.page = page
        this.menuDeposito = this.page.locator('a#deposit-menu[href="/pt/deposit"]:visible')
        this.programaVip = this.page.getByText('Vantagens e bônus especiais')
    }

    async depositoNavigation(creds: CredenciaisLogin) {
        const login = new Login(this.page)
        await login.navigationLogin(creds)

        await this.page.waitForTimeout(5000)
        if (await this.programaVip.isVisible()) {
            this.page.getByText('Não mostrar novamente').click()
        }
        await this.menuDeposito.click()
        await this.page.waitForTimeout(5000)
    }
}