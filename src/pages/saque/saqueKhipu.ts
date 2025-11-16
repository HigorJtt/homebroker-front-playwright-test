import { Page, Locator, expect } from '@playwright/test'

import { Saque } from '@/src/components/navigation/saque/saque'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class SaqueKhipuPage {
    readonly page: Page
    readonly imgCriptomoedas: Locator
    readonly tituloCriptomoedas: Locator
    readonly valorlimiteDiarioCriptomoedas: Locator
    readonly valorMinimoCriptomoedas: Locator
    readonly valorMaximoCriptomoedas: Locator
    readonly imgTransferenciaBancaria: Locator
    readonly tituloTransferenciaBancaria: Locator
    readonly valorMinimoTransferenciaBancaria: Locator
    readonly valorMaximoTransferenciaBancaria: Locator
    readonly botaoRevisarSaque: Locator
    readonly botaoCancelar: Locator
    readonly titleInformeSeusDadosBancarios: Locator

    constructor(page: Page) {
        /* Mapeamento da tela inicial do saque*/
        this.page = page
        this.imgCriptomoedas = page.getByAltText('Crypto Icon')
        this.tituloCriptomoedas = page.getByText('Crypto').first()
        this.valorMinimoCriptomoedas = page.getByText(/Valor mínimo por saque:\s*(?:R\$|\$)?\s*2(?:[.,]00)?/i).first()
        this.valorMaximoCriptomoedas = page.getByText(/Valor máximo por saque:\s*(?:R\$|\$)?\s*5[\d\.,\s]*000(?:[.,]00)?/i).first()
        this.imgTransferenciaBancaria = page.getByAltText('Bank Transfer Icon')
        this.tituloTransferenciaBancaria = page.getByText('Transferencia bancaria', { exact: true })
        this.valorMinimoTransferenciaBancaria = page.getByText(/Valor mínimo por saque:\s*(?:R\$|\$)?\s*20(?:[.,]00)?/i).first()
        this.valorMaximoTransferenciaBancaria = page.getByText(/Valor máximo por saque:\s*(?:R\$|\$)?\s*5[\d\.,\s]*000(?:[.,]00)?/i).first()
        /* Mapeamento da tela de saque por Khipu */
        this.botaoRevisarSaque = this.page.getByRole('button', { name: 'Revisar saque' })
        this.botaoCancelar = this.page.getByText('Cancelar')
        this.titleInformeSeusDadosBancarios = this.page.getByText('Informe os seus dados bancários')
    }

    async abrirSaqueKhipu(creds: CredenciaisLogin) {
        const saque = new Saque(this.page)
        await saque.saqueNavigation(creds)
    }

    private async assertVisible(...items: Array<string | Locator>): Promise<void> {
        for (const item of items) {
            const locator = typeof item === 'string' ? this.page.getByText(item, { exact: true }) : item
            await expect(locator).toBeVisible({ timeout: 10000 })
        }
    }

    async validarSaqueKhipu(creds: CredenciaisLogin): Promise<void> {
        await this.abrirSaqueKhipu(creds)
        await this.assertVisible(
            this.imgCriptomoedas,
            this.tituloCriptomoedas,
            this.valorMinimoCriptomoedas,
            this.valorMaximoCriptomoedas,
            this.imgTransferenciaBancaria,
            this.tituloTransferenciaBancaria,
            this.valorMinimoTransferenciaBancaria,
            this.valorMaximoTransferenciaBancaria
        )

        const crypto = this.page.getByRole('button', { name: /Crypto/i })
        await expect(crypto.getByText('Limite diário de saques: 100')).toBeVisible()

        const transferenciaBancaria = this.page.getByRole('button', { name: /Transferencia bancaria/i })
        await expect(transferenciaBancaria.getByText('Limite diário de saques: 100')).toBeVisible()

        await this.tituloTransferenciaBancaria.click()

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
        await expect(this.botaoCancelar).toBeVisible()

        await this.botaoRevisarSaque.click()

        await this.assertVisible(
            /* Mapeamento da modal de dados bancários */
            'Informe os seus dados bancários',
            'Informe seus próprios dados. Não informe dados de terceiros. Se os dados da conta forem inválidos, sua transação será recusada.',
            'Código do banco',
            'Tipo de conta',
        )

        await expect(this.page.getByText('Tipo de documento', { exact: true }).first()).toBeVisible({ timeout: 10000 })
        await expect(this.page.getByText('Tipo de beneficiário', { exact: true }).first()).toBeVisible({ timeout: 10000 })
        await expect(this.page.getByText('Número da conta bancária', { exact: true }).first()).toBeVisible({ timeout: 10000 })
    }
}