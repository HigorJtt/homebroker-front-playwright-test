import { Page, Locator } from '@playwright/test'

import { Login } from '@/src/components/navigation/login/login'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class Deposito {
    readonly page: Page
    readonly menuDeposito: Locator
    readonly lblProgramaVip: Locator
    readonly lblBlackFriday: Locator

    constructor(page: Page) {
        this.page = page
        this.menuDeposito = this.page.locator('a#deposit-menu[href="/pt/deposit"]:visible')
        this.lblProgramaVip = this.page.getByText('Vantagens e bônus especiais')
        this.lblBlackFriday = this.page.getByText('Black Week HomeBroker')
    }

    async depositoNavigation(creds: CredenciaisLogin) {
        const login = new Login(this.page)
        await login.navigationLogin(creds)

        await this.page.waitForTimeout(5000)

        if (await this.lblProgramaVip.isVisible()) {
            this.page.getByText('Não mostrar novamente').click()
        }
        await this.page.waitForTimeout(5000)
        await this.menuDeposito.click()
        await this.page.waitForTimeout(5000)
    }
}