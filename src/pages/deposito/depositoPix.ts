import { Page, Locator, expect } from '@playwright/test'

import { Deposito } from '@/src/components/navigation/deposito/deposito'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class DepositoPage {
    readonly page: Page
    readonly titulo: Locator
    readonly descricao: Locator
    readonly tituloPix: Locator
    readonly valorMinimoPix: Locator
    readonly descricaoPix: Locator
    readonly tituloCriptomoedas: Locator
    readonly valorMinimoCryptomoedas: Locator
    readonly descriptionCriptomoedas: Locator
    readonly descricaoImportante: Locator
    readonly escolhaValorTitulo: Locator
    readonly escolhaValorDescricao: Locator
    readonly inserirCodigoTexto: Locator
    readonly codigoCupomTexto: Locator
    readonly placeholderCodigoCupom: Locator
    readonly loginBotao: Locator
    readonly termosCondicoesTexto: Locator
    readonly transacaoProtegidaTexto: Locator
    readonly codigoPixTexto: Locator
    readonly valor: Locator
    readonly descriptionCodigoPUX: Locator
    readonly botaoCopiarCodigoPix: Locator
    readonly botaoCopiarCodigoPixCopiado: Locator
    readonly botaoVoltarInvestir: Locator
    readonly imgQRCode: Locator

    constructor(page: Page) {
        this.page = page
        /*--- Mapeamento da tela de "Selecione o tipo de depósito" ---*/
        this.titulo = this.page.getByText('Selecione o tipo de depósito')
        this.descricao = this.page.getByText('Nossa plataforma oferece uma conta de trading além da conta de prática. Cada uma opera de forma independente, com saldos e métodos de depósito separados.')
        /*--- Mapeamento da tela de "Selecione o tipo de depósito - Pix" ---*/
        this.tituloPix = this.page.getByText('Pix').first()
        this.valorMinimoPix = this.page.getByText('Valor mínimo: R$60.00')
        this.descricaoPix = this.page.getByText('Depósitos por pix são processados em poucos minutos')
        /*--- Mapeamento da tela de "Selecione o tipo de depósito - Criptomoeda" ---*/
        this.tituloCriptomoedas = this.page.getByText('Criptomoeda').first()
        this.valorMinimoCryptomoedas = this.page.getByText('Valor mínimo: 10 USDT')
        this.descriptionCriptomoedas = this.page.getByText('O tempo de processamento do depósito de criptomoeda pode variar dependendo da blockchain utilizada')
        this.descricaoImportante = this.page.getByText('Importante: A forma de depósito é a mesma para saques. Certifique-se de selecionar a conta que corresponde ao seu método de preferência.')
        this.transacaoProtegidaTexto = this.page.getByText('Transação protegida – você está em um ambiente seguro com criptografia de 256 bits')
        /*--- Mapeamento da tela de "Escolha o valor" ---*/
        this.escolhaValorTitulo = this.page.getByText('Escolha o valor')
        this.escolhaValorDescricao = this.page.getByText('Note que todos os valores estão em real')
        this.inserirCodigoTexto = this.page.getByText('Tem um código de cupom? Insira abaixo.')
        this.codigoCupomTexto = this.page.getByLabel('Código do cupom')
        this.placeholderCodigoCupom = this.page.getByPlaceholder('Digite o código do cupom')
        this.loginBotao = this.page.getByRole('button', { name: 'Aplicar' })
        this.termosCondicoesTexto = this.page.getByText('Depósitos por pix são processados em poucos minutos. Ao continuar, concordo com os ')
        /*--- Mapeamento da tela de "QR Code" ---*/
        this.codigoPixTexto = this.page.getByText('Seu código pix')
        this.valor = this.page.getByText('R$40,000.00')
        this.descriptionCodigoPUX = this.page.getByText('Lembramos que a conta onde será feito o depósito deverá estar cadastrada no mesmo CPF.')
        this.botaoCopiarCodigoPix = this.page.getByRole('button', { name: 'Copiar código pix' })
        this.botaoCopiarCodigoPixCopiado = this.page.getByRole('button', { name: 'Código PIX copiado!' })
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
            this.titulo,
            this.descricao,
            this.tituloPix,
            this.valorMinimoPix,
            this.descricaoPix,
            this.tituloCriptomoedas,
            this.valorMinimoCryptomoedas,
            this.descriptionCriptomoedas,
            this.descricaoImportante,
            this.transacaoProtegidaTexto
        )

        await this.tituloPix.click()
        await expect(this.escolhaValorTitulo).toBeVisible({ timeout: 10000 })

        await this.assertVisible(
            this.escolhaValorTitulo,
            this.escolhaValorDescricao,
            this.inserirCodigoTexto,
            this.codigoCupomTexto,
            this.loginBotao,
            this.termosCondicoesTexto,
            this.transacaoProtegidaTexto
        )

        await expect(this.placeholderCodigoCupom).toHaveAttribute('placeholder', 'Digite o código do cupom')

        const listaValores = [
            {
                valor: 'R$60',
            },
            {
                valor: 'R$100'
            },
            {
                valor: 'R$250'
            },
            {
                valor: 'R$500',
            },
            {
                valor: 'R$1,000'
            },
            {
                valor: 'R$5,000'
            },
            {
                valor: 'R$10,000'
            },
            {
                valor: 'R$40,000'
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
            const depositPattern = new RegExp(`Depósito\\s+R\\$\\s*${intPattern}${decimalPart}`)

            const button = this.page.getByRole('button', { name: valor })
            await expect(button).toBeVisible({ timeout: 5000 })
            await button.click()

            await expect(this.page.locator(`input[value="${valor}"]`)).toBeVisible({ timeout: 5000 })
            await expect(this.page.getByText(depositPattern).first()).toBeVisible({ timeout: 5000 })
        }

        await this.page.getByRole('button', { name: 'Depósito R$40,000.00' }).click()

        await Promise.all([
            this.codigoPixTexto.waitFor({ timeout: 10000 })
        ])

        await this.assertVisible(
            this.valor,
            this.descriptionCodigoPUX,
            this.botaoCopiarCodigoPix,
            this.botaoVoltarInvestir,
            this.transacaoProtegidaTexto
        )

        await expect(this.imgQRCode).toBeVisible({ timeout: 10000 })
    }
}