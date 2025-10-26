import { Page, Locator, expect } from '@playwright/test'

import { Deposito } from '@/src/components/navigation/deposito/deposito'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class DepositoSpeiPage {
    readonly page: Page
    readonly titulo: Locator
    readonly descricao: Locator
    readonly imgCriptomoedas: Locator
    readonly tituloCriptomoeda: Locator
    readonly valorMinimoCriptomoeda: Locator
    readonly descricaoCriptomoeda: Locator
    readonly imgSpei: Locator
    readonly tituloSpei: Locator
    readonly valorMinimoSpei: Locator
    readonly descricaoSpei: Locator
    readonly imgOxxo: Locator
    readonly tituloOxxo: Locator
    readonly valorMinimoOxxo: Locator
    readonly descricaoOxxo: Locator
    readonly escolhaValorTitulo: Locator
    readonly escolhaValorDescricao: Locator
    readonly inserirCodigoTexto: Locator
    readonly codigoCupomTexto: Locator
    readonly placeholderCodigoCupom: Locator
    readonly aplicarBotao: Locator
    readonly descricaoImportante: Locator
    readonly termosCondicoesTexto: Locator
    readonly transacaoProtegidaTexto: Locator
    readonly redirecionamentoTexto: Locator
    readonly codigoSpeiTexto: Locator
    readonly valor: Locator
    readonly descriptionCodigoOxxo: Locator
    readonly botaoCopiarCodigoOxxo: Locator
    readonly botaoCopiarCodigoPixCopiado: Locator
    readonly botaoVoltarInvestir: Locator
    readonly imgQRCode: Locator

    constructor(page: Page) {
        this.page = page
        /*--- Mapeamento da tela de "Selecione o tipo de depósito" ---*/
        this.titulo = this.page.getByText('Selecione o tipo de depósito')
        this.descricao = this.page.getByText('Nossa plataforma oferece uma conta de trading além da conta de prática. Cada uma opera de forma independente, com saldos e métodos de depósito separados.')
        /*--- Mapeamento da tela de "Selecione o tipo de depósito - Criptomoeda" ---*/
        this.imgCriptomoedas = this.page.getByAltText('Crypto Icon')
        this.tituloCriptomoeda = this.page.getByText('Criptomoeda').first()
        this.valorMinimoCriptomoeda = this.page.getByText('Valor mínimo: 10 USDT')
        this.descricaoCriptomoeda = this.page.getByText('O tempo de processamento do depósito de criptomoeda pode variar dependendo da blockchain utilizada')
        /*--- Mapeamento da tela de "Selecione o tipo de depósito - Spei" ---*/
        this.imgSpei = this.page.getByAltText('SPEI Icon')
        this.tituloSpei = this.page.getByText('SPEI').first()
        this.descricaoSpei = this.page.getByText('90% dos depósitos por SPEI são processados em poucos minutos')
        /*--- Mapeamento da tela de "Selecione o tipo de depósito - OXXO" ---*/
        this.imgOxxo = this.page.getByAltText('OXXO Icon')
        this.tituloOxxo = this.page.getByText('OXXO').first()
        this.descricaoOxxo = this.page.getByText('Os pagamentos OXXO serão creditados em 1 ou 2 dias úteis')
        this.descricaoImportante = this.page.getByText('Importante: A forma de depósito é a mesma para saques. Certifique-se de selecionar a conta que corresponde ao seu método de preferência.')
        /*--- Mapeamento da tela de "Escolha o valor" ---*/
        this.escolhaValorTitulo = this.page.getByText('Escolha o valor')
        this.escolhaValorDescricao = this.page.getByText('Note que todos os valores estão em peso mexicano')
        this.inserirCodigoTexto = this.page.getByText('Tem um código de cupom? Insira abaixo.')
        this.codigoCupomTexto = this.page.getByLabel('Código do cupom')
        this.placeholderCodigoCupom = this.page.getByPlaceholder('Digite o código do cupom')
        this.aplicarBotao = this.page.getByRole('button', { name: 'Aplicar' })
        this.termosCondicoesTexto = this.page.getByText('90% dos depósitos por SPEI são processados em poucos minutos. Ao continuar, concordo com os')
        this.transacaoProtegidaTexto = this.page.getByText('Transação protegida – você está em um ambiente seguro com criptografia de 256 bits')
        this.redirecionamentoTexto = this.page.getByText('Você será redirecionado para o nosso parceiro de pagamentos para concluir seu depósito.').first()
        /*--- Mapeamento da tela de "código de pagamento" ---*/
        this.codigoSpeiTexto = this.page.getByText('Seu código de pagamento')
        this.valor = this.page.getByText('MX$200.00')
        this.descriptionCodigoOxxo = this.page.getByText('Lembramos que a conta onde será feito o depósito deverá estar cadastrada no mesmo CURP.')
        this.botaoCopiarCodigoOxxo = this.page.getByRole('button', { name: 'Abrir página de pagamento' })
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
            this.titulo,
            this.descricao,
            this.imgCriptomoedas,
            this.tituloCriptomoeda,
            this.valorMinimoCriptomoeda,
            this.descricaoCriptomoeda,
            this.imgSpei,
            this.tituloSpei,
            this.descricaoSpei,
            this.imgOxxo,
            this.tituloOxxo,
            this.descricaoOxxo,
            this.descricaoImportante,
            this.transacaoProtegidaTexto
        )

        const spei = this.page.getByRole('link', { name: /SPEI/i })
        await expect(spei.getByText('Valor mínimo: MX$200.00')).toBeVisible()

        const oxxo = this.page.getByRole('link', { name: /OXXO/i })
        await expect(oxxo.getByText('Valor mínimo: MX$200.00')).toBeVisible()

        await this.tituloSpei.click()

        await this.assertVisible(
            this.escolhaValorTitulo,
            this.imgSpei,
            this.escolhaValorDescricao,
            this.termosCondicoesTexto,
            this.transacaoProtegidaTexto,
            this.redirecionamentoTexto
        )

        await expect(this.page.getByText('Valor mínimo: MX$200', { exact: true })).toBeVisible()

        const listaValores = [
            {
                valor: 'MX$200'
            },
            {
                valor: 'MX$400'
            },
            {
                valor: 'MX$600'
            },
            {
                valor: 'MX$1,000'
            },
            {
                valor: 'MX$2,000'
            },
            {
                valor: 'MX$5,000'
            },
            {
                valor: 'MX$10,000'
            },
            {
                valor: 'MX$20,000'
            }
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
            this.inserirCodigoTexto,
            this.placeholderCodigoCupom,
            this.codigoCupomTexto,
            this.aplicarBotao
        )

        await this.page.getByRole('button', { name: 'MX$200' }).click()
        await this.page.getByRole('button', { name: 'Depósito MX$200.00' }).click()

        await Promise.all([
            this.codigoSpeiTexto.waitFor({ timeout: 10000 })
        ])

        await this.assertVisible(
            this.valor,
            this.descriptionCodigoOxxo,
            this.botaoCopiarCodigoOxxo,
            this.transacaoProtegidaTexto,
            this.imgQRCode
        )

        const listaStepsPagamentos = [
            {
                step: '1.',
                name: 'Acesse seu banco.'
            },
            {
                step: '2.',
                name: 'Opte por pagar por SPEI.'
            },
            {
                step: '3.',
                name: 'Siga as instruções na página de pagamento'
            },
            {
                step: '4.',
                name: 'Este código é válido por 2 horas.'
            }
        ]

        for (const { step, name } of listaStepsPagamentos) {
            await this.assertVisible(
                this.page.getByText(step),
                this.page.getByText(name)
            )
        }
    }
}