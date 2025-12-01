import test from '@playwright/test'

import { usuariosProgramaVip } from '@/src/configs/massas'
import { ProgramaVipPage } from '@/src/pages/minhaConta/programaVip/programaVip'

test.describe('Programa VIP', () => {

    test('Validar Programa VIP - Usuário Standard', async ({ page }) => {
        const programaVipPage = new ProgramaVipPage(page)
        await programaVipPage.validarProgramaVipStandard(usuariosProgramaVip.usuarioStandard)
    })

    test('Validar Programa VIP - Usuário Black', async ({ page }) => {
        const programaVipPage = new ProgramaVipPage(page)
        await programaVipPage.validarProgramaVipBlack(usuariosProgramaVip.usuarioBlack)
    })
})