import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class AlterarSenhaPage {
    readonly page: Page
    readonly alterarSenha: Locator
    readonly voltarBotao: Locator
    readonly mudeSuaSenha: Locator
    readonly senhaAntiga: Locator
    readonly placeholderSenhaAntiga: Locator
    readonly novaSenha: Locator
    readonly placeholderNovaSenha: Locator
    readonly confirmeSuaSenha: Locator
    readonly placeholderConfirmeSuaSenha: Locator
    readonly salvarBotao: Locator
    readonly cancelarBotao: Locator
    readonly mensagemInformativaSenhaAntiga: Locator
    readonly mensagemInformativaNovaSenha: Locator
    readonly alert: Locator

    constructor(page: Page) {
        this.page = page
        this.alterarSenha = this.page.getByText('Alterar sua senha').first()
        this.voltarBotao = this.page.getByRole('button', { name: 'voltar' })
        this.mudeSuaSenha = this.page.getByText('Mude sua senha')
        this.senhaAntiga = this.page.getByText('Senha antiga').first()
        this.placeholderSenhaAntiga = this.page.locator('input[placeholder="Insira sua senha antiga"]')
        this.novaSenha = this.page.getByText('Nova senha').first()
        this.placeholderNovaSenha = this.page.locator('input[placeholder="Insira uma nova senha"]')
        this.confirmeSuaSenha = this.page.getByText('Confirme sua senha').first()
        this.placeholderConfirmeSuaSenha = this.page.locator('input[placeholder="Confirme sua senha"]')
        this.salvarBotao = this.page.getByRole('button', { name: 'Salvar' })
        this.cancelarBotao = this.page.getByText('Cancelar')
        this.mensagemInformativaSenhaAntiga = this.page.getByText('A senha é obrigatória')
        this.mensagemInformativaNovaSenha = this.page.getByText('Pelo menos 8 caracteres')
        this.alert = this.page.getByRole('alert')
    }

    async abrirAlterarSenha(creds: CredenciaisLogin) {
        const navigation = new Configuracoes(this.page)
        await navigation.configuracoesNavigation(creds)
    }

    private async assertVisible(...items: Array<string | Locator>) {
        for (const item of items) {
            const locator = typeof item === 'string' ? this.page.getByText(item, { exact: true }) : item
            await expect(locator).toBeVisible()
        }
    }

    async validarAlterarSenha(creds: CredenciaisLogin) {
        await this.abrirAlterarSenha(creds)

        await this.alterarSenha.click()

        await Promise.all([
            expect(this.placeholderSenhaAntiga).toHaveAttribute('placeholder', 'Insira sua senha antiga'),
            expect(this.placeholderNovaSenha).toHaveAttribute('placeholder', 'Insira uma nova senha'),
            expect(this.placeholderConfirmeSuaSenha).toHaveAttribute('placeholder', 'Confirme sua senha')
        ])

        await this.assertVisible(
            this.voltarBotao,
            this.mudeSuaSenha,
            this.senhaAntiga,
            this.novaSenha,
            this.confirmeSuaSenha,
            this.salvarBotao,
            this.cancelarBotao,
            this.placeholderSenhaAntiga,
            this.placeholderNovaSenha,
            this.placeholderConfirmeSuaSenha
        )
    }

    async validarMensagensInformativaSenhaObrigatoria(creds: CredenciaisLogin) {
        await this.abrirAlterarSenha(creds)

        await this.alterarSenha.click()
        await this.salvarBotao.click()
        await this.assertVisible(this.mensagemInformativaSenhaAntiga, this.mensagemInformativaNovaSenha)
    }

    async validarMensagemInformativaConfirmeSuaSenha(creds: CredenciaisLogin) {
        await this.abrirAlterarSenha(creds)

        await this.alterarSenha.click()
        await this.salvarBotao.click()
        await this.placeholderSenhaAntiga.fill('Senha@123')
        await this.placeholderNovaSenha.fill('senhateste')
        await this.placeholderConfirmeSuaSenha.fill('senhateste1')
        await this.salvarBotao.click()
        await this.assertVisible(this.page.getByText('As senhas são diferentes'))
    }

    async validarMensagemSenhaAlterada(creds: CredenciaisLogin) {
        await this.abrirAlterarSenha(creds)

        await this.alterarSenha.click()
        await this.salvarBotao.click()
        await this.placeholderSenhaAntiga.fill('senha@123')
        await this.placeholderNovaSenha.fill('senha@123')
        await this.placeholderConfirmeSuaSenha.fill('senha@123')
        await this.salvarBotao.click()
        await expect(this.alert.filter({ hasText: 'Sua senha foi alterada com sucesso. Você precisa logar novamente.' })).toBeVisible({ timeout: 10000 })
    }
}