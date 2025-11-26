import { Page, Locator, expect } from '@playwright/test'

import { Saque } from '@/src/components/navigation/saque/saque'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class SaqueSpeiPage {
    readonly page: Page
    readonly imgCriptomoedas: Locator
    readonly tituloCriptomoedas: Locator
    readonly valorlimiteDiarioCriptomoedas: Locator
    readonly valorMinimoCriptomoedas: Locator
    readonly valorMaximoCriptomoedas: Locator
    readonly imgOxxo: Locator
    readonly tituloOxxo: Locator
    readonly imgTransferenciaBancaria: Locator
    readonly tituloTransferenciaBancaria: Locator
    readonly valorMinimoTransferenciaBancaria: Locator
    readonly valorMaximoTransferenciaBancaria: Locator
    readonly botaoRevisarSaque: Locator
    readonly botaoCancelar: Locator

    constructor(page: Page) {
        this.page = page
        /*--- Mapeamento da tela de saque por OXXO ---*/
        this.imgOxxo = this.page.getByAltText('OXXO Icon')
        this.tituloOxxo = this.page.getByText('OXXO').first()
        /*--- Mapeamento da tela de saque por SPEI ---*/
        this.imgTransferenciaBancaria = page.getByAltText('SPEI Icon')
        this.tituloTransferenciaBancaria = page.getByText('SPEI', { exact: true })
        this.valorMinimoTransferenciaBancaria = page.getByText(/Valor mínimo por saque:\s*(?:MX\$|\$)?\s*200(?:[.,]00)?/i).first()
        this.valorMaximoTransferenciaBancaria = page.getByText(/Valor máximo por saque:\s*(?:MX\$|\$)?\s*20[\d\.,\s]*000(?:[.,]00)?/i).first()
        /*--- Mapeamento da tela de saque por Crypto ---*/
        this.imgCriptomoedas = page.getByAltText('Crypto Icon')
        this.tituloCriptomoedas = page.getByText('Crypto').first()
        this.valorMinimoCriptomoedas = page.getByText(/Valor mínimo por saque:\s*(?:R\$|\$)?\s*2(?:[.,]00)?/i).first()
        this.valorMaximoCriptomoedas = page.getByText(/Valor máximo por saque:\s*(?:R\$|\$)?\s*5[\d\.,\s]*000(?:[.,]00)?/i).first()
        /*--- Mapeamento da tela de saque ---*/
        this.botaoRevisarSaque = this.page.getByText('Revisar saque')
        this.botaoCancelar = this.page.getByText('Cancelar')
    }

    async abrirSaqueSpei(creds: CredenciaisLogin) {
        const saque = new Saque(this.page)
        await saque.saqueNavigation(creds)
    }

    private async assertVisible(...items: Array<string | Locator>): Promise<void> {
        for (const item of items) {
            const locator = typeof item === 'string' ? this.page.getByText(item, { exact: true }) : item
            await expect(locator).toBeVisible({ timeout: 10000 })
        }
    }

    private async assertNotVisible(...items: Array<string | Locator>): Promise<void> {
        for (const item of items) {
            const locator = typeof item === 'string' ? this.page.getByText(item, { exact: true }) : item
            const count = await locator.count()
            if (count === 0) continue
            for (let i = 0; i < count; i++) {
                await expect(locator.nth(i)).toBeHidden({ timeout: 5000 })
            }
        }
    }

    async validarSaqueSpei(creds: CredenciaisLogin): Promise<void> {
        await this.abrirSaqueSpei(creds)
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
        await expect(crypto.getByText('Limite diário de saques: 100', { exact: true })).toBeVisible()

        const transferenciaBancaria = this.page.getByRole('button', { name: /SPEI/i })
        await expect(transferenciaBancaria.getByText('Limite diário de saques: 100', { exact: true })).toBeVisible()

        await this.assertNotVisible(
            this.imgOxxo,
            this.tituloOxxo
        )

        await this.tituloTransferenciaBancaria.click()

        await expect(this.page.getByText('O saque será feito para o código SPEI associado ao CURP', { exact: false }).first()).toBeVisible({ timeout: 10000 })
        await expect(this.page.getByText('que foi validado durante o processo de verificação da conta. Observe que todos os valores estão em pesos mexicanos.', { exact: false }).first()).toBeVisible({ timeout: 10000 })

        await this.assertVisible(
            /* Mapeamento da tela de saque por Khipu */
            'Insira o valor',
            'Não é possível modificar seu CURP. Se você acha que há algum erro, entre em contato conosco.',
            'Valor disponível',
            'Valor solicitado',
            'Taxa de transferência',
            'Total a ser transferido',
            'Essa transação está sujeita a cobrança de taxas'
        )

        const valorInput = this.page.locator('#outlined-basic').first()
        await expect(valorInput).toBeVisible({ timeout: 5000 })
        await valorInput.fill('20000')
        await expect(this.botaoCancelar).toBeVisible()

        await this.botaoRevisarSaque.click()

        await this.assertVisible(
            /* Mapeamento da modal de dados bancários */
            'Informe os seus dados bancários',
            'Informe seus próprios dados. Não informe dados de terceiros. Se os dados da conta forem inválidos, sua transação será recusada.',
            'Código do banco',
        )

        await expect(this.page.getByText('Número da conta bancária', { exact: true }).first()).toBeVisible({ timeout: 10000 })
    }
}