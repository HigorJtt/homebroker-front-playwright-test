import test from '@playwright/test'

import { DepositoPage } from '@/src/pages/deposito/depositoPix'
import { DepositoInfluencerPage } from '@/src/pages/deposito/depositoInfluencer'
import { DepositoOxxoPage } from '@/src/pages/deposito/depositoOxxo'
import { usuarioDepositPix, usuarioInfluencer, usuarioMexico } from '@/src/configs/massas'

test.describe('Depósitos', () => {

    test('Validar fluxo de depósito por "Pix"', async ({ page }) => {

        const deposito = new DepositoPage(page)
        await deposito.validarDeposito(usuarioDepositPix)
    })

    test('Validar fluxo de depósito por influencer', async ({ page }) => {

        const deposito = new DepositoInfluencerPage(page)
        await deposito.validarDeposito(usuarioInfluencer)
    })

    test('Validar fluxo de depósito "Oxxo"', async ({ page }) => {

        const deposito = new DepositoOxxoPage(page)
        await deposito.validarDeposito(usuarioMexico)
    })
})