import { Page, Locator, expect } from '@playwright/test'

import { Saque } from '@/src/components/navigation/minhaConta/saque/saque'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class SaquePixPage {
    readonly page: Page
    readonly imgPix: Locator
    readonly tituloPix: Locator
    readonly valorlimiteDiarioPix: Locator
    readonly valorMinimoPix: Locator
    readonly valorMaximoPix: Locator
    readonly imgCriptomoedas: Locator
    readonly valorlimiteDiarioCriptomoedas: Locator
    readonly valorMinimoCriptomoedas: Locator
    readonly valorMaximoCriptomoedas: Locator
    readonly tituloValorSaque: Locator
    readonly botaoRevisarSaque: Locator
    readonly botaoCancelar: Locator
    readonly botaoConfirmarRetirada: Locator

    constructor(page: Page) {
        this.page = page
        /*--- Mapeamento da tela inicial de saque por PIX ---*/
        this.imgPix = this.page.locator('div', { hasText: 'PIX' }).locator('svg').first()
        this.tituloPix = page.getByText('PIX', { exact: true })
        this.valorMinimoPix = page.getByText('Valor mínimo por saque: R$50.00')
        this.valorMaximoPix = page.getByText('Valor máximo por saque: R$5,000.00')
        /*--- Mapeamento da tela inicial de saque por Crypto ---*/
        this.imgCriptomoedas = page.getByAltText('Crypto Icon')
        this.valorMinimoCriptomoedas = page.getByText('Valor mínimo por saque: $2.00')
        this.valorMaximoCriptomoedas = page.getByText('Valor máximo por saque: $5,000')
        /*--- Mapeamento da tela de saque ---*/
        this.botaoRevisarSaque = this.page.getByRole('button', { name: 'Revisar saque' })
        this.botaoCancelar = this.page.getByText('Cancelar')
        /*--- Mapeamento da tela de revise sua solicitação ---*/
        this.botaoConfirmarRetirada = this.page.getByRole('button', { name: 'Confirmar retirada' })
    }

    async abrirSaquePix(creds: CredenciaisLogin) {
        const saque = new Saque(this.page)
        await saque.saqueNavigation(creds)
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

    async validarSaquePix(creds: CredenciaisLogin): Promise<void> {
        await this.abrirSaquePix(creds)
        await this.assertVisible(
            this.imgPix,
            this.tituloPix,
            this.valorMinimoPix,
            this.valorMaximoPix,
            this.imgCriptomoedas,
            'Crypto',
            this.valorMinimoCriptomoedas,
            this.valorMaximoCriptomoedas
        )

        const pix = this.page.getByRole('button', { name: /PIX/i })
        await expect(pix.getByText('Limite diário de saques: 100')).toBeVisible()

        const crypto = this.page.getByRole('button', { name: /Crypto/i })
        await expect(crypto.getByText('Limite diário de saques: 100')).toBeVisible()

        await this.tituloPix.click()
        const saqueValorTextoUm = /^O depósito será feito na conta com a chave pix associada ao CPF\b[\s\S]*/i
        await expect(this.page.getByText(saqueValorTextoUm).first()).toBeVisible({ timeout: 10000 })

        await expect(this.page.getByText('que foi validado no processo de verificação da conta.', { exact: false }).first()).toBeVisible({ timeout: 10000 })
        await expect(this.page.getByText('Favor notar que os valores estão em Real.', { exact: false }).first()).toBeVisible({ timeout: 10000 })

        await this.assertVisible(
            'Valor do saque',
            'Não é possível alterar seu CPF. Se seu CPF não for esse, entre em contato com Serviço ao consumidor.',
            'Valor disponível',
            'Valor solicitado',
            'Taxa de transferência',
            'Total a ser transferido'
        )

        const valorInput = this.page.locator('#outlined-basic').first()
        await expect(valorInput).toBeVisible({ timeout: 5000 })

        await valorInput.fill('10000')
        await expect(this.botaoCancelar).toBeVisible()
        await this.botaoRevisarSaque.click()

        await this.assertVisible(
            'Revise sua solicitação',
            'Verifique as informações antes de fazer o saque',
            'Valor solicitado',
            'Taxa de transferência',
            'Total a ser transferido',
            'CPF',
            'A retirada pode levar até 3 dias',
            'Editar valor solicitado',
            'Cancelar'
        )
    }
}