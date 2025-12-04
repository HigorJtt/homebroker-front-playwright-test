import { Page, expect, Locator } from '@playwright/test'

import { Perfil } from '@/src/components/navigation/minhaConta/perfil/perfil'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class PerfilPage {
    readonly page: Page
    readonly inpPlaceholderCPF: Locator
    readonly inpPlaceholderPrimeiroNome: Locator
    readonly inpPlaceholderSobrenome: Locator
    readonly inpPlaceholderDataNascimento: Locator
    readonly btnSalvar: Locator

    constructor(page: Page) {
        this.page = page
        this.inpPlaceholderCPF = this.page.locator('input[placeholder="Insira seu CPF"]')
        this.inpPlaceholderPrimeiroNome = this.page.locator('input[placeholder="Digite seu primeiro nome"]')
        this.inpPlaceholderSobrenome = this.page.locator('input[placeholder="Digite seu sobrenome"]')
        this.inpPlaceholderDataNascimento = this.page.locator('input[placeholder="dd/mm/yyyy"]')
        this.btnSalvar = this.page.getByRole('button', { name: 'Salvar' })
    }

    async abrirPerfil(creds: CredenciaisLogin) {
        const navigation = new Perfil(this.page)
        await navigation.perfilNavigation(creds)
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

    async validarPerfil(creds: CredenciaisLogin): Promise<void> {
        await this.abrirPerfil(creds)
        await this.assertVisible(
            'Observe que as informações usadas abaixo correspondem ao seu documento de identidade governamental válido para verificação de identidade, depósitos e saques. Se precisar de mais assistência, entre em contato conosco.',
        )

        await this.assertVisible(
            'E-mail',
            'CPF',
            'Primeiro nome',
            'Sobrenome',
            'Data de nascimento',
            'Número de telefone',
            this.btnSalvar,
            'Cancelar'
        )

        await expect(this.page.getByText('Confirmo que tenho pelo menos 18 anos e concordo com os', { exact: false })).toBeVisible()

    }

    async validarCamposObrigatorios(creds: CredenciaisLogin): Promise<void> {
        await this.abrirPerfil(creds)
        await this.page.getByRole('button', { name: 'Salvar' }).click()
        await this.assertVisible(
            'CPF inválido',
            'Digite seu primeiro nome',
            'Apenas letras são permitidas'
        )
    }

    async validarCpfExistente(creds: CredenciaisLogin): Promise<void> {
        await this.abrirPerfil(creds)
        await this.inpPlaceholderCPF.fill('06786744184')
        await this.inpPlaceholderPrimeiroNome.fill('Teste')
        await this.inpPlaceholderSobrenome.fill('Automatizado')
        await this.inpPlaceholderDataNascimento.fill('23022000')
        await this.page.getByRole('button', { name: 'Salvar' }).click()
        await this.assertVisible('O CPF informado já está sendo usado por outro usuário')
    }

    async validarUsuarioMenorIdade(creds: CredenciaisLogin): Promise<void> {
        await this.abrirPerfil(creds)
        await this.inpPlaceholderCPF.fill('12345678909')
        await this.inpPlaceholderPrimeiroNome.fill('Teste')
        await this.inpPlaceholderSobrenome.fill('Automatizado')
        await this.inpPlaceholderDataNascimento.fill('23022010')
        await this.page.getByRole('button', { name: 'Salvar' }).click()
        await this.assertVisible('Para utilizar a nossa plataforma, você deve ter 18 anos ou mais')
    }
}