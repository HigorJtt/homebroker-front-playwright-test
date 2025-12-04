import { Page, Locator, expect } from '@playwright/test'

import { Deposito } from '@/src/components/navigation/deposito/deposito'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class DepositoSpeiPage {
    readonly page: Page
    readonly imgCriptomoedas: Locator
    readonly imgSpei: Locator
    readonly lblTituloSpei: Locator
    readonly imgOxxo: Locator
    readonly lblTransacaoProtegida: Locator
    readonly lblRedirecionamento: Locator
    readonly btnAplicar: Locator

    constructor(page: Page) {
        this.page = page
        /*--- Mapeamento da tela de "Selecione o tipo de depósito - Criptomoeda" ---*/
        this.imgCriptomoedas = this.page.getByAltText('Crypto Icon')
        /*--- Mapeamento da tela de "Selecione o tipo de depósito - Spei" ---*/
        this.imgSpei = this.page.getByAltText('SPEI Icon')
        this.lblTituloSpei = this.page.getByText('SPEI').first()
        /*--- Mapeamento da tela de "Selecione o tipo de depósito - OXXO" ---*/
        this.imgOxxo = this.page.getByAltText('OXXO Icon')
        /*--- Mapeamento da tela de "Selecione o tipo de depósito" ---*/
        this.lblTransacaoProtegida = this.page.getByText('Transação protegida – você está em um ambiente seguro com criptografia de 256 bits')
        this.lblRedirecionamento = this.page.getByText('Você será redirecionado para o nosso parceiro de pagamentos para concluir seu depósito.').first()
        /*--- Mapeamento da tela de "Escolha o valor" ---*/
        this.btnAplicar = this.page.getByRole('button', { name: 'Aplicar' })
    }

    async abrirDeposito(creds: CredenciaisLogin): Promise<void> {
        const navigation = new Deposito(this.page)
        await navigation.depositoNavigation(creds)
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

    async validarDeposito(creds: CredenciaisLogin): Promise<void> {
        await this.abrirDeposito(creds)

        await this.assertVisible(
            /*--- Mapeamento da tela de "Selecione o tipo de depósito ---*/
            'Selecione o tipo de depósito',
            'Nossa plataforma oferece uma conta de trading além da conta de prática. Cada uma opera de forma independente, com saldos e métodos de depósito separados.',
            /*--- Mapeamento da tela de "Selecione o tipo de depósito - Criptomoeda" ---*/
            this.imgCriptomoedas,
            'Criptomoeda',
            'Valor mínimo: 10 USDT',
            'O tempo de processamento do depósito de criptomoeda pode variar dependendo da blockchain utilizada',
            /*--- Mapeamento da tela de "Selecione o tipo de depósito - Spei" ---*/
            this.imgSpei,
            'SPEI',
            '90% dos depósitos por SPEI são processados em poucos minutos',
            /*--- Mapeamento da tela de "Selecione o tipo de depósito - OXXO" ---*/
            this.imgOxxo,
            'OXXO',
            'Os pagamentos OXXO serão creditados em 1 ou 2 dias úteis',
            'Importante: A forma de depósito é a mesma para saques. Certifique-se de selecionar a conta que corresponde ao seu método de preferência.',
            this.lblTransacaoProtegida
        )

        const spei = this.page.getByRole('link', { name: /SPEI/i })
        await expect(spei.getByText('Valor mínimo: MX$200.00')).toBeVisible()

        const oxxo = this.page.getByRole('link', { name: /OXXO/i })
        await expect(oxxo.getByText('Valor mínimo: MX$200.00')).toBeVisible()

        await this.lblTituloSpei.click()

        await this.assertVisible(
            /*--- Mapeamento da tela de "Escolha o valor" ---*/
            'Escolha o valor',
            this.imgSpei,
            'Note que todos os valores estão em peso mexicano',
            '90% dos depósitos por SPEI são processados em poucos minutos. Ao continuar, concordo com os Termos e condições.',
            this.lblTransacaoProtegida,
            this.lblRedirecionamento
        )

        await expect(this.page.getByText('Valor mínimo: MX$200', { exact: true })).toBeVisible()

        const listaValores = [
            { valor: 'MX$200' },
            { valor: 'MX$400' },
            { valor: 'MX$600' },
            { valor: 'MX$1,000' },
            { valor: 'MX$2,000' },
            { valor: 'MX$5,000' },
            { valor: 'MX$10,000' },
            { valor: 'MX$20,000' }
        ]

        function numberPatternFromDigits(digitsStr) {
            return String(digitsStr).replace(/\B(?=(\d{3})+(?!\d))/g, '\\D?')
        }

        for (const { valor } of listaValores) {

            const onlyDigits = valor.replace(/[^\d]/g, '')
            /* --- tolerância a separadores de milhar ---*/
            const intPattern = numberPatternFromDigits(onlyDigits)
            /* --- aceita opcionalmente a parte decimal com 2 casas (ponto ou vírgula) ---*/
            const decimalPart = '(?:[.,]\\d{2})?'
            const depositPattern = new RegExp(`Depósito\\s+MX\\$\\s*${intPattern}${decimalPart}`)

            const button = this.page.getByRole('button', { name: valor })
            await expect(button).toBeVisible({ timeout: 5000 })
            await button.click()

            await expect(this.page.locator(`input[value="${valor}"]`)).toBeVisible({ timeout: 5000 })
            await expect(this.page.getByText(depositPattern).first()).toBeVisible({ timeout: 5000 })
        }

        await this.assertNotVisible(
            'Tem um código de cupom? Insira abaixo.',
            'Digite o código do cupom',
            'Código do cupom',
            this.btnAplicar
        )

        expect(this.page.getByRole('button', { name: 'MX$20,000.00' })).toBeVisible()
        expect(this.page.getByRole('button', { name: 'Depósito MX$20,000.00' })).toBeVisible()
    }
}