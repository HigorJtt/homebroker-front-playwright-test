import test from '@playwright/test'

import { usuarioDepositPix, usuarioInfluencer, usuarioChile, usuarioColombia, usuarioMexico } from '@/src/configs/massas'
import { SaqueInfluencerPage } from '@/src/pages/minhaConta/saque/saqueInfluencer'
import { SaqueKhipuPage } from '@/src/pages/minhaConta/saque/saqueKhipu'
import { SaquePixPage } from '@/src/pages/minhaConta/saque/saquePix'
import { SaquePsePage } from '@/src/pages/minhaConta/saque/saquePse'
import { SaqueSpeiPage } from '@/src/pages/minhaConta/saque/saqueSpei'

test.describe('Saques', () => {

    test('Validar tela de saque por "PIX"', async ({ page }) => {
        const saquePix = new SaquePixPage(page)
        await saquePix.validarSaquePix(usuarioDepositPix)
    })

    test('Validar tela saque por "Influencer"', async ({ page }) => {
        const saqueInfluencer = new SaqueInfluencerPage(page)
        await saqueInfluencer.validarSaqueInfluencer(usuarioInfluencer)
    })

    test('Validar tela de saque por "Khipu"', async ({ page }) => {
        const saqueKhipu = new SaqueKhipuPage(page)
        await saqueKhipu.validarSaqueKhipu(usuarioChile)
    })

    test('Validar tela de saque por "PSE"', async ({ page }) => {
        const saquePse = new SaquePsePage(page)
        await saquePse.validarSaquePse(usuarioColombia)
    })

    test('Validar tela de saque por "SPEI"', async ({ page }) => {
        const saqueSpei = new SaqueSpeiPage(page)
        await saqueSpei.validarSaqueSpei(usuarioMexico)
    })
})