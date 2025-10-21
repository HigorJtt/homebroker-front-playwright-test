import test from '@playwright/test'

import { ConfiguracoesPage } from '@/src/pages/minhaConta/configuracoes/configuracoes.page'
import { IdiomaPage } from '@/src/pages/minhaConta/configuracoes/idioma.page'
import { ProTraderPage } from '@/src/pages/minhaConta/configuracoes/protrader.page'
import { SomPage } from '@/src/pages/minhaConta/configuracoes/som.page'
import { DesempenhoPage } from '@/src/pages/minhaConta/configuracoes/desempenho.page'
import { AlterarSenhaPage } from '@/src/pages/minhaConta/configuracoes/alterarSenha.page'
import { AutenticacaoDoisFatoresPage } from '@/src/pages/minhaConta/configuracoes/autenticacaoDoisFatores.page'
import { usuariosLogin } from '@/src/configs/massas'

test.describe('Configurações', () => {

    test('Validar tela de "Configurações"', async ({ page }) => {

        const configuracoes = new ConfiguracoesPage(page)
        await configuracoes.validarConfiguracoes(usuariosLogin.login)
    })

    test('Validar tela de "Idioma"', async ({ page }) => {

        const idioma = new IdiomaPage(page)
        await idioma.validarIdioma(usuariosLogin.login)
    })

    test('Validar tela de "ProTrader"', async ({ page }) => {

        const proTrader = new ProTraderPage(page)
        await proTrader.validarProTrader(usuariosLogin.login)
    })

    test('Validar tela de "Som"', async ({ page }) => {

        const sons = new SomPage(page)
        await sons.validarSom(usuariosLogin.login)
    })

    test('Validar tela de "Desempenho"', async ({ page }) => {

        const desempenho = new DesempenhoPage(page)
        await desempenho.validarDesempenho(usuariosLogin.login)
    })

    test('Validar tela de "Alterar Senha"', async ({ page }) => {
        const alterarSenha = new AlterarSenhaPage(page)
        await alterarSenha.validarAlterarSenha(usuariosLogin.login)
    })

    test('Validar mensagem informativa da de senha obrigária na tela de "Alterar senha"', async ({ page }) => {
        const alterarSenha = new AlterarSenhaPage(page)
        await alterarSenha.validarMensagensInformativaSenhaObrigatoria(usuariosLogin.login)
    })

    test('Validar mensagem informativa de senhas diferentes na tela de "Alterar senha"', async ({ page }) => {
        const alterarSenha = new AlterarSenhaPage(page)
        await alterarSenha.validarMensagemInformativaConfirmeSuaSenha(usuariosLogin.login)
    })

    test('Validar alteração de senha na tela de "Alterar senha"', async ({ page }) => {
        const alterarSenha = new AlterarSenhaPage(page)
        await alterarSenha.validarMensagemSenhaAlterada(usuariosLogin.login)
    })

    test('Validar tela de "Autenticação de dois fatores (2FA)"', async ({ page }) => {
        const autenticacaoDoisFatores = new AutenticacaoDoisFatoresPage(page)
        await autenticacaoDoisFatores.validarAutenticacaoDoisFatores(usuariosLogin.login)
    })
})