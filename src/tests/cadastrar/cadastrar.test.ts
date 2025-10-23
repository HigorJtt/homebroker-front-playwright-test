import test from '@playwright/test'

import { CadastrarPage } from '@/src/pages/cadastrar/cadastrar'
import { usuariosCadastro } from '@/src/configs/massas'

test.describe('Cadastrar', () => {

    test('Validar informações da tela de Cadastro', async ({ page }) => {

        const loginPage = new CadastrarPage(page)
        await loginPage.validarCadastrar()
    })

    test('Validar mensagens informativas do E-mail, senha e número de telefone', async ({ page }) => {

        const cadastrarPage = new CadastrarPage(page)
        await cadastrarPage.validarMensagensInformativas()
    })

    test('Validar mensagem informativa de número de telefone existente', async ({ page }) => {

        const cadastrarPage = new CadastrarPage(page)
        await cadastrarPage.validarMensagemInformativaTelefoneExistente(usuariosCadastro.usuarioNumeroTelefoneExistente)
    })

    test('Validar mensagem informativa de E-mail existente', async ({ page }) => {

        const cadastrarPage = new CadastrarPage(page)
        await cadastrarPage.validarMensagemInformativaEmailExistente(usuariosCadastro.usuarioEmailExistente)
    })
})