import test from '@playwright/test'

import { DepositoPage } from '@/src/pages/deposito/depositoPix'
import { DepositoInfluencerPage } from '@/src/pages/deposito/depositoInfluencer'
import { DepositoOxxoPage } from '@/src/pages/deposito/depositoOxxo'
import { DepositoSpeiPage } from '@/src/pages/deposito/depositoSpei'
import { DepositoCriptomoedasPage } from '@/src/pages/deposito/depositoCriptomoedas'
import { DepositoKhipuPage } from '@/src/pages/deposito/depositoKhipu'
import { usuarioChile, usuarioCryptomoedas, usuarioDepositPix, usuarioInfluencer, usuarioMexico, usuarioColombia } from '@/src/configs/massas'
import { DepositoPsePage } from '@/src/pages/deposito/depositoPse'

test.describe('Depósitos', () => {

    test('Validar fluxo de depósito por "Pix"', async ({ page }) => {

        const deposito = new DepositoPage(page)
        await deposito.validarDeposito(usuarioDepositPix)
    })

    test('Validar fluxo de depósito por "Influencer"', async ({ page }) => {

        const deposito = new DepositoInfluencerPage(page)
        await deposito.validarDeposito(usuarioInfluencer)
    })

    test('Validar fluxo de depósito por "Oxxo"', async ({ page }) => {

        const deposito = new DepositoOxxoPage(page)
        await deposito.validarDeposito(usuarioMexico)
    })

    test('Validar fluxo de depósito por "Spei"', async ({ page }) => {

        const deposito = new DepositoSpeiPage(page)
        await deposito.validarDeposito(usuarioMexico)
    })

    test('Validar fluxo de depósito por "Khipu"', async ({ page }) => {

        const deposito = new DepositoKhipuPage(page)
        await deposito.validarDeposito(usuarioChile)
    })

    test('Validar fluxo de depósito por "Criptomoedas"', async ({ page }) => {

        const deposito = new DepositoCriptomoedasPage(page)
        await deposito.validarDeposito(usuarioCryptomoedas)
    })

    test('Validar fluxo de depósito por "Pse"', async ({ page }) => {
        const deposito = new DepositoPsePage(page)
        await deposito.validarDeposito(usuarioColombia)
    })
})