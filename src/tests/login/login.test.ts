import test from '@playwright/test'

import { LoginPage } from '@/src/pages/login/login'
import { usuariosLogin } from '@/src/configs/massas'

test.describe('Login', () => {

    test('Validar informações da tela de Login', async ({ page }) => {

        const loginPage = new LoginPage(page)
        await loginPage.validarLoginHomebroker()
    })

    test('Validar mensagem informativa de E-mail e senha obrigatórias', async ({ page }) => {

        const loginPage = new LoginPage(page)
        await loginPage.validarMensagemInformativaEmailSenha()
    })

    test('Validar mensagem informativa de senha incorreta', async ({ page }) => {

        const loginPage = new LoginPage(page)
        await loginPage.validarMensagemInformativaSenhaIncorreta(usuariosLogin.usuarioSenhaIncorreta)
    })
})