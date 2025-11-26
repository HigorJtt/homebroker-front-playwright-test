import { Page, Locator, expect } from '@playwright/test'

import { Deposito } from '@/src/components/navigation/deposito/deposito'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class DepositoKhipuPage {
    readonly page: Page
    readonly titulo: Locator
    readonly descricao: Locator
    readonly imgCriptomoedas: Locator
    readonly tituloCriptomoeda: Locator
    readonly valorMinimoCriptomoeda: Locator
    readonly descricaoCriptomoeda: Locator
    readonly imgKhipu: Locator
    readonly tituloKhipu: Locator
    readonly valorMinimoKhipu: Locator
    readonly descricaoKhipu: Locator
    readonly escolhaValorTitulo: Locator
    readonly escolhaValorDescricao: Locator
    readonly valorMinimoKhipuEscolhaValor: Locator
    readonly inserirCodigoTexto: Locator
    readonly codigoCupomTexto: Locator
    readonly placeholderCodigoCupom: Locator
    readonly redirecionamentoTexto: Locator
    readonly aplicarBotao: Locator
    readonly termosCondicoesTexto: Locator
    readonly descricaoImportante: Locator
    readonly transacaoProtegidaTexto: Locator
    readonly codigoKhipuTexto: Locator
    readonly valor: Locator
    readonly descriptionCodigoKhipu: Locator
    readonly botaoCopiarCodigoKhipu: Locator
    readonly botaoCopiarCodigoPixCopiado: Locator
    readonly botaoVoltarInvestir: Locator
    readonly imgQRCode: Locator

    constructor(page: Page) {
        this.page = page
        /*--- Mapeamento da tela de "Selecione o tipo de depósito - Criptomoeda" ---*/
        this.imgCriptomoedas = this.page.getByAltText('Crypto Icon')
        this.tituloCriptomoeda = this.page.getByText('Criptomoeda').first()
        /*--- Mapeamento da tela de "Selecione o tipo de depósito - Khipu" ---*/
        this.imgKhipu = this.page.getByAltText('Khipu Icon')
        this.tituloKhipu = this.page.getByText('Khipu').first()
        this.transacaoProtegidaTexto = this.page.getByText('Transação protegida – você está em um ambiente seguro com criptografia de 256 bits')
        /*--- Mapeamento da tela de "Escolha o valor" ---*/
        this.codigoCupomTexto = this.page.getByLabel('Código do cupom')
        this.placeholderCodigoCupom = this.page.getByPlaceholder('Digite o código do cupom')
        this.aplicarBotao = this.page.getByRole('button', { name: 'Aplicar' })
        this.redirecionamentoTexto = this.page.getByText('Você será redirecionado para o nosso parceiro de pagamentos para concluir seu depósito.').first()
        /*--- Mapeamento da tela de "código de pagamento" ---*/
        this.codigoKhipuTexto = this.page.getByText('Finalize seu pagamento usando o link abaixo')
        this.valor = this.page.getByText('Valor solicitado: $200.00')
        this.descriptionCodigoKhipu = this.page.getByText('Por favor, note que a conta de onde o depósito será feito deve estar registrada sob o mesmo número de identidade.')
        this.botaoCopiarCodigoKhipu = this.page.getByRole('button', { name: 'Abrir página de pagamento' })
        this.botaoVoltarInvestir = this.page.getByText('Voltar para Investir')
        this.imgQRCode = this.page.locator('img[alt="QRcode"]')
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

    async validarDeposito(creds: CredenciaisLogin): Promise<void> {
        await this.abrirDeposito(creds)

        await this.assertVisible(
            /*--- Mapeamento da tela de "Selecione o tipo de depósito" ---*/
            'Selecione o tipo de depósito',
            'Nossa plataforma oferece duas contas de trading além da conta de prática. Cada uma opera de forma independente, com saldos e métodos de depósito separados.',
            /*--- Mapeamento da tela de "Selecione o tipo de depósito - Criptomoeda" ---*/
            this.imgCriptomoedas,
            this.tituloCriptomoeda,
            'Valor mínimo: 10 USDT',
            'O tempo de processamento do depósito de criptomoeda pode variar dependendo da blockchain utilizada',
            /*--- Mapeamento da tela de "Selecione o tipo de depósito - Khipu" ---*/
            this.imgKhipu,
            this.tituloKhipu,
            'Valor mínimo: $10.00',
            '90% dos depósitos feitos via Khipu são processados em minutos.',
            'Importante: A forma de depósito é a mesma para saques. Certifique-se de selecionar a conta que corresponde ao seu método de preferência.',
            this.transacaoProtegidaTexto
        )

        await this.tituloKhipu.click()

        await this.assertVisible(
            'Escolha o valor',
            'Observe que todos os valores estão em dólares americanos (USD).',
            this.imgKhipu,
            'Valor mínimo: $10',
            'Tem um código de cupom? Insira abaixo.',
            this.placeholderCodigoCupom,
            this.codigoCupomTexto,
            '90% dos depósitos feitos via Khipu são processados em poucos minutos. Ao continuar, concordo com os Termos e condições.',
            this.aplicarBotao,
            this.redirecionamentoTexto,
        )

        const listaValores = [
            { valor: '$20' },
            { valor: '$40' },
            { valor: '$60' },
            { valor: '$100' },
            { valor: '$200' },
            { valor: '$500' },
            { valor: '$1,000' },
            { valor: '$2,000' }
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

        await this.page.getByRole('button', { name: '$200', exact: true }).click()
        await this.page.getByRole('button', { name: 'Depósito $200.00', exact: true }).click()

        await Promise.all([
            this.codigoKhipuTexto.waitFor({ timeout: 10000 })
        ])

        await this.assertVisible(
            this.valor,
            this.descriptionCodigoKhipu,
            this.botaoCopiarCodigoKhipu,
            this.transacaoProtegidaTexto,
            this.imgQRCode
        )

        const listaStepsPagamentos = [
            {
                step: '1.',
                name: 'Abra a página com o link abaixo ou com o código QR.'
            },
            {
                step: '2.',
                name: 'Siga as instruções na página de pagamento.'
            },
            {
                step: '3.',
                name: 'Este código é válido por 6 horas.'
            }
        ]

        function escapeForRegex(str: string) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
        }

        for (const { step, name } of listaStepsPagamentos) {
            /* ---  buscar o step apenas quando ele aparecer no início do texto (ex.: "1." no começo) --- */
            const escapedStep = step.replace(/\./g, '\\.')
            const stepRegex = new RegExp(`^\\s*${escapedStep}`)
            const stepLocator = this.page.getByText(stepRegex)

            /* --- criar regex tolerante para o texto do passo (escapa caracteres especiais e aceita variações de espaço/pontuação) --- */
            const nameRegex = new RegExp(escapeForRegex(name), 'i')
            const nameLocator = this.page.getByText(nameRegex)

            await this.assertVisible(
                stepLocator,
                nameLocator
            )
        }
    }
}