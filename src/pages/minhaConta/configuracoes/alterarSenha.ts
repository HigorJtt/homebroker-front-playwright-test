import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class AlterarSenhaPage {
    readonly page: Page
    readonly btnAlterarSenha: Locator
    readonly btnVoltarBotao: Locator
    readonly inpPlaceholderSenhaAntiga: Locator
    readonly inpPlaceholderNovaSenha: Locator
    readonly inpPlaceholderConfirmeSuaSenha: Locator
    readonly btnSalvar: Locator
    readonly alert: Locator

    constructor(page: Page) {
        this.page = page
        this.btnAlterarSenha = this.page.getByText('Alterar sua senha').first()
        this.btnVoltarBotao = this.page.getByRole('button', { name: 'voltar' })
        this.inpPlaceholderSenhaAntiga = this.page.locator('input[placeholder="Insira sua senha antiga"]')
        this.inpPlaceholderNovaSenha = this.page.locator('input[placeholder="Insira uma nova senha"]')
        this.inpPlaceholderConfirmeSuaSenha = this.page.locator('input[placeholder="Confirme sua senha"]')
        this.btnSalvar = this.page.getByRole('button', { name: 'Salvar' })
        this.alert = this.page.getByRole('alert')
    }

    async abrirAlterarSenha(creds: CredenciaisLogin) {
        const navigation = new Configuracoes(this.page)
        await navigation.configuracoesNavigation(creds)
    }

    private async assertVisible(...items: Array<string | Locator>): Promise<void> {
        for (const item of items) {
            const locator = typeof item === 'string'
                ? this.page.getByText(item, { exact: true }).first()
                : item
            const count = await locator.count()
            if (count === 0) {
                throw new Error(`Elemento não encontrado: ${typeof item === 'string' ? item : locator.toString()}`)
            }
            await expect(locator.first()).toBeVisible({ timeout: 10000 })
        }
    }
    async validarAlterarSenha(creds: CredenciaisLogin) {
        await this.abrirAlterarSenha(creds)

        await this.btnAlterarSenha.click()

        await Promise.all([
            expect(this.inpPlaceholderSenhaAntiga).toHaveAttribute('placeholder', 'Insira sua senha antiga'),
            expect(this.inpPlaceholderNovaSenha).toHaveAttribute('placeholder', 'Insira uma nova senha'),
            expect(this.inpPlaceholderConfirmeSuaSenha).toHaveAttribute('placeholder', 'Confirme sua senha')
        ])

        await this.assertVisible(
            this.btnVoltarBotao,
            'Mude sua senha',
            'Senha antiga',
            'Nova senha',
            'Confirme sua senha',
            this.btnSalvar,
            'Cancelar'
        )
    }

    async validarMensagensInformativaSenhaObrigatoria(creds: CredenciaisLogin) {
        await this.abrirAlterarSenha(creds)

        await this.btnAlterarSenha.click()
        await this.btnSalvar.click()
        await this.assertVisible('A senha é obrigatória', 'Pelo menos 8 caracteres')
    }

    async validarMensagemInformativaConfirmeSuaSenha(creds: CredenciaisLogin) {
        await this.abrirAlterarSenha(creds)

        await this.btnAlterarSenha.click()
        await this.btnSalvar.click()
        await this.inpPlaceholderSenhaAntiga.fill('Senha@123')
        await this.inpPlaceholderNovaSenha.fill('senhateste')
        await this.inpPlaceholderConfirmeSuaSenha.fill('senhateste1')
        await this.btnSalvar.click()
        await this.assertVisible(this.page.getByText('As senhas são diferentes'))
    }

    async validarMensagemSenhaAlterada(creds: CredenciaisLogin) {
        await this.abrirAlterarSenha(creds)

        await this.btnAlterarSenha.click()
        await this.btnSalvar.click()
        await this.inpPlaceholderSenhaAntiga.fill('senha@123')
        await this.inpPlaceholderNovaSenha.fill('senha@123')
        await this.inpPlaceholderConfirmeSuaSenha.fill('senha@123')
        await this.btnSalvar.click()
        await expect(this.alert.filter({ hasText: 'Sua senha foi alterada com sucesso. Você precisa logar novamente.' })).toBeVisible({ timeout: 10000 })
    }
}