import test from '@playwright/test'

import { DepositoPage } from '@/src/pages/deposito/depositoPix'
import { DepositoInfluencerPage } from '@/src/pages/deposito/depositoInfluencer'
import { usuarioDepositPix, usuarioInfluencer } from '@/src/configs/massas'


test.describe('Depósitos', () => {

    test('Validar fluxo de depósito por "PIX"', async ({ page }) => {

        const deposito = new DepositoPage(page)
        await deposito.validarDeposito(usuarioDepositPix)
    })

    test('Validar fluxo de depósito "PIX" por usuário influencer', async ({ page }) => {

        const deposito = new DepositoInfluencerPage(page)
        await deposito.validarDeposito(usuarioInfluencer)
    })
})