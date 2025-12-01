import { Page, expect, Locator } from '@playwright/test'

import { Perfil } from '@/src/components/navigation/minhaConta/perfil/perfil'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class PerfilPage {
    readonly page: Page
    readonly placeholderCPF: Locator
    readonly placeholderPrimeiroNome: Locator
    readonly placeholderSobrenome: Locator
    readonly palceholderDataNascimento: Locator

    constructor(page: Page) {
        this.page = page
        this.placeholderCPF = this.page.locator('input[placeholder="Insira seu CPF"]')
        this.placeholderPrimeiroNome = this.page.locator('input[placeholder="Digite seu primeiro nome"]')
        this.placeholderSobrenome = this.page.locator('input[placeholder="Digite seu sobrenome"]')
        this.palceholderDataNascimento = this.page.locator('input[placeholder="dd/mm/yyyy"]')
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

        await expect(this.page.getByText('E-mail').first()).toBeVisible()
        await expect(this.page.getByText('CPF').first()).toBeVisible()

        await expect(this.page.getByText('Primeiro nome').first()).toBeVisible()
        await expect(this.page.getByText('Sobrenome').first()).toBeVisible()

        await expect(this.page.getByText('Data de nascimento').first()).toBeVisible()
        await expect(this.page.getByText('Número de telefone').first()).toBeVisible()

        await expect(this.page.getByText('Confirmo que tenho pelo menos 18 anos e concordo com os', { exact: false })).toBeVisible()

        await expect(this.page.getByRole('button', { name: 'Salvar' })).toBeVisible()
        await expect(this.page.getByText('Cancelar')).toBeVisible()
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
        await this.placeholderCPF.fill('06786744184')
        await this.placeholderPrimeiroNome.fill('Teste')
        await this.placeholderSobrenome.fill('Automatizado')
        await this.palceholderDataNascimento.fill('23022000')
        await this.page.getByRole('button', { name: 'Salvar' }).click()
        await this.assertVisible('O CPF informado já está sendo usado por outro usuário')
    }

    async validarUsuarioMenorIdade(creds: CredenciaisLogin): Promise<void> {
        await this.abrirPerfil(creds)
        await this.placeholderCPF.fill('12345678909')
        await this.placeholderPrimeiroNome.fill('Teste')
        await this.placeholderSobrenome.fill('Automatizado')
        await this.palceholderDataNascimento.fill('23022010')
        await this.page.getByRole('button', { name: 'Salvar' }).click()
        await this.assertVisible('Para utilizar a nossa plataforma, você deve ter 18 anos ou mais')
    }
}