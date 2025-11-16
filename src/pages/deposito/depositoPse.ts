import { Page, Locator, expect } from '@playwright/test'

import { Deposito } from '@/src/components/navigation/deposito/deposito'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class DepositoPsePage {
    readonly page: Page
    readonly imgCriptomoedas: Locator
    readonly tituloCriptomoeda: Locator
    readonly imgPse: Locator
    readonly tituloPse: Locator
    readonly transacaoProtegidaTexto: Locator
    readonly escolhaValorTitulo: Locator
    readonly placeholderCodigoCupom: Locator
    readonly aplicarBotao: Locator
    readonly redirecionamentoTexto: Locator

    constructor(page: Page) {
        this.page = page
        /*--- Mapeamento da tela de "Selecione o tipo de depósito - Criptomoeda" ---*/
        this.imgCriptomoedas = this.page.getByAltText('Crypto Icon')
        this.tituloCriptomoeda = this.page.getByText('Criptomoeda').first()
        /*--- Mapeamento da tela de "Selecione o tipo de depósito - PSE" ---*/
        this.imgPse = this.page.getByAltText('PSE Icon')
        this.tituloPse = this.page.getByText('PSE').first()
        this.transacaoProtegidaTexto = this.page.getByText('Transação protegida – você está em um ambiente seguro com criptografia de 256 bits')
        /*--- Mapeamento da tela de "Escolha o valor" ---*/
        this.escolhaValorTitulo = this.page.getByText('Escolha o valor')
        this.placeholderCodigoCupom = this.page.getByPlaceholder('Digite o código do cupom')
        this.aplicarBotao = this.page.getByRole('button', { name: 'Aplicar' })
        this.redirecionamentoTexto = this.page.getByText('Você será redirecionado para o nosso parceiro de pagamentos para concluir seu depósito.').first()
    }

    async abrirDeposito(creds: CredenciaisLogin): Promise<void> {
        const navigation = new Deposito(this.page)
        await navigation.depositoNavigation(creds)
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

    async validarDeposito(creds: CredenciaisLogin): Promise<void> {
        await this.abrirDeposito(creds)

        await this.assertVisible(
            /*--- Mapeamento da tela de "Selecione o tipo de depósito" ---*/
            'Selecione o tipo de depósito',
            'Nossa plataforma oferece uma conta de trading além da conta de prática. Cada uma opera de forma independente, com saldos e métodos de depósito separados.',
            /*--- Mapeamento da tela de "Selecione o tipo de depósito - Criptomoeda" ---*/
            this.imgCriptomoedas,
            this.tituloCriptomoeda,
            'Valor mínimo: 10 USDT',
            'O tempo de processamento do depósito de criptomoeda pode variar dependendo da blockchain utilizada',
            /*--- Mapeamento da tela de "Selecione o tipo de depósito - PSE" ---*/
            this.imgPse,
            this.tituloPse,
            'Valor mínimo: $10.00',
            '90% dos depósitos feitos via PSE são processados em poucos minutos',
            'Importante: A forma de depósito é a mesma para saques. Certifique-se de selecionar a conta que corresponde ao seu método de preferência.',
            this.transacaoProtegidaTexto
        )

        await this.tituloPse.click()

        await expect(this.escolhaValorTitulo).toBeVisible({ timeout: 10000 })

        await this.assertVisible(
            /*--- Mapeamento da tela de "Escolha o valor" ---*/
            this.escolhaValorTitulo,
            this.imgPse,
            'Observe que todos os valores estão em dólares americanos (USD).',
            'Valor mínimo: $10',
            '90% dos depósitos por PSE são processados em poucos minutos. Ao continuar, concordo com os Termos e condições.',
            this.transacaoProtegidaTexto,
        )

        const listaValores = [
            { valor: '$200' },
            { valor: '$400' },
            { valor: '$600' },
            { valor: '$1,000' },
            { valor: '$2,000' },
            { valor: '$5,000' },
            { valor: '$10,000' },
            { valor: '$20,000' }
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
            const depositPattern = new RegExp(`Depósito\\s+\\$\\s*${intPattern}${decimalPart}`)

            const button = this.page.getByRole('button', { name: valor, exact: true })
            await expect(button).toBeVisible({ timeout: 5000 })
            await button.click()

            await expect(this.page.locator(`input[value="${valor}"]`)).toBeVisible({ timeout: 5000 })
            await expect(this.page.getByText(depositPattern).first()).toBeVisible({ timeout: 5000 })
        }

        await this.assertNotVisible(
            'Tem um código de cupom? Insira abaixo.',
            this.placeholderCodigoCupom,
            'Código do cupom',
            this.aplicarBotao
        )

        expect(this.page.getByRole('button', { name: '$200', exact: true }))
        expect(this.page.getByRole('button', { name: 'Depósito $200.00', exact: true }))
    }
}