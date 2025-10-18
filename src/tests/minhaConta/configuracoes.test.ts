import test from '@playwright/test'

import { ConfiguracoesPage } from '@/src/pages/configuracoes/configuracoes.page'
import { MinhaContaPage } from '@/src/pages/minhaConta/minhaConta.page'
import { usarioLoginCorreto } from '@/src/configs/massas'

test.describe('Configurações', () => {

    test('Validar tela de "Minha conta"', async ({ page }) => {

        const minhaConta = new MinhaContaPage(page)
        await minhaConta.validarMinhaConta(usarioLoginCorreto.email, usarioLoginCorreto.senha)
    })

    test('Validar tela de "Configurações"', async ({ page }) => {

        const configuracoes = new ConfiguracoesPage(page)
        await configuracoes.validarConfiguracoes(usarioLoginCorreto.email, usarioLoginCorreto.senha)
    })

    test('Validar tela de "Idioma"', async ({ page }) => {

        const configuracoes = new ConfiguracoesPage(page)
        await configuracoes.validarIdioma(usarioLoginCorreto.email, usarioLoginCorreto.senha)
    })

    test('Validar tela de "ProTrader"', async ({ page }) => {

        const ProTrader = new ConfiguracoesPage(page)
        await ProTrader.validarProTrader(usarioLoginCorreto.email, usarioLoginCorreto.senha)
    })

    test('Validar tela de "Sons"', async ({ page }) => {

        const sons = new ConfiguracoesPage(page)
        await sons.validaSons(usarioLoginCorreto.email, usarioLoginCorreto.senha)
    })
})