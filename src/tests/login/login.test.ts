import test from '@playwright/test'

import { LoginPage } from '@/src/pages/login/login.page'

test.describe('Login', () => {

    test('Validar informações da tela de Login', async ({ page }) => {

        const loginPage = new LoginPage(page)
        await loginPage.validarLoginHomebroker()
    })

    test('Validar mensagem informativa de e-mail e senha obrigatórias', async ({ page }) => {

        const loginPage = new LoginPage(page)
        await loginPage.validarMensagemInformativaEmailSenha()
    })
})