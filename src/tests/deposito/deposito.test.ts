import test from '@playwright/test'

import { DepositoPage } from '@/src/pages/deposito/deposito'
import { usuarioDepositPix } from '@/src/configs/massas'


test.describe('Depósito', () => {

    test('Validar tela de "Depósito"', async ({ page }) => {

        const deposito = new DepositoPage(page)
        await deposito.validarDeposito(usuarioDepositPix)
    })
})