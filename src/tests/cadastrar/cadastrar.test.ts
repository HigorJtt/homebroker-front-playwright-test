import test from '@playwright/test'

import { CadastrarPage } from '@/src/pages/cadastrar/cadastrar'
import { usuariosCadastro } from '@/src/configs/massas'

test.describe('Cadastrar', () => {

    test('Validar informações da tela de Cadastro', async ({ page }) => {

        const loginPage = new CadastrarPage(page)
        await loginPage.validarCadastrar()
    })

    test('Validar mensagens informativas do E-mail, Senha e Número de telefone', async ({ page }) => {

        const cadastrarPage = new CadastrarPage(page)
        await cadastrarPage.validarMensagensInformativas()
    })

    test('Validar mensagem informativa de número de telefone já existente', async ({ page }) => {

        const cadastrarPage = new CadastrarPage(page)
        await cadastrarPage.validarMensagemInformativaTelefoneExistente(usuariosCadastro.usuarioNumeroTelefoneExistente)
    })

    test('Validar mensagem informativa de senha incorreta', async ({ page }) => {

        const cadastrarPage = new CadastrarPage(page)
        await cadastrarPage.validarMensagemInformativaSenhaIncorreta(usuariosCadastro.usuarioEmailExistente)
    })
})