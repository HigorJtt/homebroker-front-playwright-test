import { Page, Locator, expect } from '@playwright/test'

import { Saque } from '@/src/components/navigation/minhaConta/saque/saque'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class SaquePsePage {
    readonly page: Page
    readonly imgCriptomoedas: Locator
    readonly lblTituloCriptomoedas: Locator
    readonly lblValorMinimoCriptomoedas: Locator
    readonly lblValorMaximoCriptomoedas: Locator
    readonly imgTransferenciaBancaria: Locator
    readonly lblTituloTransferenciaBancaria: Locator
    readonly lblValorMinimoTransferenciaBancaria: Locator
    readonly lblValorMaximoTransferenciaBancaria: Locator
    readonly btnRevisarSaque: Locator
    readonly btnCancelar: Locator

    constructor(page: Page) {
        this.page = page
        /*--- Mapeamento da tela inicial de saque por Crypto ---*/
        this.imgCriptomoedas = page.getByAltText('Crypto Icon')
        this.lblTituloCriptomoedas = page.getByText('Crypto').first()
        this.lblValorMinimoCriptomoedas = page.getByText(/Valor mínimo por saque:\s*(?:R\$|\$)?\s*2(?:[.,]00)?/i).first()
        this.lblValorMaximoCriptomoedas = page.getByText(/Valor máximo por saque:\s*(?:R\$|\$)?\s*5[\d\.,\s]*000(?:[.,]00)?/i).first()
        /*--- Mapeamento da tela inicial de saque por PSE ---*/
        this.imgTransferenciaBancaria = page.getByAltText('Bank Transfer Icon')
        this.lblTituloTransferenciaBancaria = page.getByText('Transferencia bancaria', { exact: true })
        this.lblValorMinimoTransferenciaBancaria = page.getByText(/Valor mínimo por saque:\s*(?:R\$|\$)?\s*20(?:[.,]00)?/i).first()
        this.lblValorMaximoTransferenciaBancaria = page.getByText(/Valor máximo por saque:\s*(?:R\$|\$)?\s*5[\d\.,\s]*000(?:[.,]00)?/i).first()
        /*--- Mapeamento da tela de saque ---*/
        this.btnRevisarSaque = this.page.getByRole('button', { name: 'Revisar saque' })
        this.btnCancelar = this.page.getByText('Cancelar')
    }

    async abrirSaquePse(creds: CredenciaisLogin) {
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

    async validarSaquePse(creds: CredenciaisLogin): Promise<void> {
        await this.abrirSaquePse(creds)
        await this.assertVisible(
            this.imgCriptomoedas,
            this.lblTituloCriptomoedas,
            this.lblValorMinimoCriptomoedas,
            this.lblValorMaximoCriptomoedas,
            this.imgTransferenciaBancaria,
            this.lblTituloTransferenciaBancaria,
            this.lblValorMinimoTransferenciaBancaria,
            this.lblValorMaximoTransferenciaBancaria
        )

        const crypto = this.page.getByRole('button', { name: /Crypto/i })
        await expect(crypto.getByText('Limite diário de saques: 100')).toBeVisible()

        const transferenciaBancaria = this.page.getByRole('button', { name: /Transferencia bancaria/i })
        await expect(transferenciaBancaria.getByText('Limite diário de saques: 100')).toBeVisible()

        await this.lblTituloTransferenciaBancaria.click()

        await expect(this.page.getByText('O saque será realizado para a pessoa com número de documento', { exact: false }).first()).toBeVisible({ timeout: 10000 })
        await expect(this.page.getByText('que foi validado durante o processo de verificação da conta. Observe que todos os valores estão em dólares americanos (USD).', { exact: false }).first()).toBeVisible({ timeout: 10000 })

        await this.assertVisible(
            /* Mapeamento da tela de saque por Khipu */
            'Insira o valor',
            'Se você acreditar que há um erro, por favor, entre em contato conosco.',
            'Valor disponível',
            'Valor solicitado',
            'Taxa de transferência',
            'Total a ser transferido',
            'Essa transação está sujeita a cobrança de taxas'
        )

        const valorInput = this.page.locator('#outlined-basic').first()
        await expect(valorInput).toBeVisible({ timeout: 5000 })
        await valorInput.fill('10000')
        await expect(this.btnCancelar).toBeVisible()

        await this.btnRevisarSaque.click()

        await this.assertVisible(
            /* Mapeamento da modal de dados bancários */
            'Informe os seus dados bancários',
            'Informe seus próprios dados. Não informe dados de terceiros. Se os dados da conta forem inválidos, sua transação será recusada.',
            'Código do banco',
            'Tipo de conta',
        )

        await expect(this.page.getByText('Tipo de documento', { exact: true }).first()).toBeVisible({ timeout: 10000 })
        await expect(this.page.getByText('Número da conta bancária', { exact: true }).first()).toBeVisible({ timeout: 10000 })
    }
}