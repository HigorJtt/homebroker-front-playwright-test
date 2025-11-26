import test from '@playwright/test'

import { usuarioPerfil } from '@/src/configs/massas'
import { PerfilPage } from '@/src/pages/minhaConta/perfil/perfil'

test.describe('Perfil', () => {

    test('Validar tela de "Informação do perfil"', async ({ page }) => {
        const perfil = new PerfilPage(page)
        await perfil.validarPerfil(usuarioPerfil)
    })
    test('Validar mensagens informativas dos campos obrigatórios na tela de "Informação do perfil"', async ({ page }) => {
        const perfil = new PerfilPage(page)
        await perfil.validarCamposObrigatorios(usuarioPerfil)
    })

    test('Validar mensagem informativa de CPF existente na tela de "Informação do perfil"', async ({ page }) => {
        const perfil = new PerfilPage(page)
        await perfil.validarCpfExistente(usuarioPerfil)
    })

    test('Validar mensagem informativa de usuário menor de idade na tela de "Informação do perfil"', async ({ page }) => {
        const perfil = new PerfilPage(page)
        await perfil.validarUsuarioMenorIdade(usuarioPerfil)
    })
})