import test from '@playwright/test'

import { MinhaContaPage } from '@/src/pages/minhaConta/minhaConta'
import { usuariosLogin } from '@/src/configs/massas'

test.describe('Minha Conta', () => {

    test('Validar tela de "Minha conta"', async ({ page }) => {

        const minhaConta = new MinhaContaPage(page)
        await minhaConta.validarMinhaConta(usuariosLogin.login)
    })
})