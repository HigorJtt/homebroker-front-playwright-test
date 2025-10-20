import test from '@playwright/test'

import { ConfiguracoesPage } from '@/src/pages/configuracoes/configuracoes.page'
import { MinhaContaPage } from '@/src/pages/minhaConta/minhaConta.page'
import { usuarioLoginCorreto } from '@/src/configs/massas'

test.describe('Configurações', () => {

    test('Validar tela de "Minha conta"', async ({ page }) => {

        const minhaConta = new MinhaContaPage(page)
        await minhaConta.validarMinhaConta(usuarioLoginCorreto)
    })

    test('Validar tela de "Configurações"', async ({ page }) => {

        const configuracoes = new ConfiguracoesPage(page)
        await configuracoes.validarConfiguracoes(usuarioLoginCorreto)
    })

    test('Validar tela de "Idioma"', async ({ page }) => {

        const configuracoes = new ConfiguracoesPage(page)
        await configuracoes.validarIdioma(usuarioLoginCorreto)
    })

    test('Validar tela de "ProTrader"', async ({ page }) => {

        const ProTrader = new ConfiguracoesPage(page)
        await ProTrader.validarProTrader(usuarioLoginCorreto)
    })

    test('Validar tela de "Sons"', async ({ page }) => {

        const sons = new ConfiguracoesPage(page)
        await sons.validaSons(usuarioLoginCorreto)
    })
})