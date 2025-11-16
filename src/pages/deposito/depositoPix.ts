import { Page, Locator, expect } from '@playwright/test'

import { Deposito } from '@/src/components/navigation/deposito/deposito'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class DepositoPage {
    readonly page: Page
    readonly imgPix: Locator
    readonly tituloPix: Locator
    readonly imgCriptomoedas: Locator
    readonly tituloCriptomoedas: Locator
    readonly transacaoProtegidaTexto: Locator
    readonly escolhaValorTitulo: Locator
    readonly codigoCupomTexto: Locator
    readonly placeholderCodigoCupom: Locator
    readonly aplicarBotao: Locator
    readonly codigoPixTexto: Locator
    readonly botaoCopiarCodigoPix: Locator
    readonly botaoCopiarCodigoPixCopiado: Locator
    readonly imgQRCode: Locator

    constructor(page: Page) {
        this.page = page
        /*--- Mapeamento da tela de "Selecione o tipo de depósito - Pix" ---*/
        this.imgPix = this.page.locator('div', { hasText: 'PIX' }).locator('svg').first()
        this.tituloPix = this.page.getByText('Pix').first()
        /*--- Mapeamento da tela de "Selecione o tipo de depósito - Criptomoeda" ---*/
        this.imgCriptomoedas = this.page.getByAltText('Crypto Icon')
        this.tituloCriptomoedas = this.page.getByText('Criptomoeda').first()
        this.transacaoProtegidaTexto = this.page.getByText('Transação protegida – você está em um ambiente seguro com criptografia de 256 bits')
        /*--- Mapeamento da tela de "Escolha o valor" ---*/
        this.escolhaValorTitulo = this.page.getByText('Escolha o valor')
        this.codigoCupomTexto = this.page.getByLabel('Código do cupom')
        this.placeholderCodigoCupom = this.page.getByPlaceholder('Digite o código do cupom')
        this.aplicarBotao = this.page.getByRole('button', { name: 'Aplicar' })
        /*--- Mapeamento da tela de "QR Code" ---*/
        this.codigoPixTexto = this.page.getByText('Seu código pix')
        this.botaoCopiarCodigoPix = this.page.getByRole('button', { name: 'Copiar código pix' })
        this.botaoCopiarCodigoPixCopiado = this.page.getByRole('button', { name: 'Código PIX copiado!' })
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
            'Nossa plataforma oferece uma conta de trading além da conta de prática. Cada uma opera de forma independente, com saldos e métodos de depósito separados.',
            /*--- Mapeamento da tela de "Selecione o tipo de depósito - Pix" ---*/
            this.imgPix,
            this.tituloPix,
            'Valor mínimo: R$60.00',
            'Depósitos por pix são processados em poucos minutos',
            /*--- Mapeamento da tela de "Selecione o tipo de depósito - Criptomoeda" ---*/
            this.imgCriptomoedas,
            this.tituloCriptomoedas,
            'Valor mínimo: 10 USDT',
            'O tempo de processamento do depósito de criptomoeda pode variar dependendo da blockchain utilizada',
            'Importante: A forma de depósito é a mesma para saques. Certifique-se de selecionar a conta que corresponde ao seu método de preferência.',
            this.transacaoProtegidaTexto
        )

        await this.tituloPix.click()
        await expect(this.escolhaValorTitulo).toBeVisible({ timeout: 10000 })

        await this.assertVisible(
            /*--- Mapeamento da tela de "Escolha o valor" ---*/
            'Escolha o valor',
            this.imgPix,
            'Note que todos os valores estão em real',
            'Tem um código de cupom? Insira abaixo.',
            this.codigoCupomTexto,
            this.placeholderCodigoCupom,
            this.aplicarBotao,
            'Depósitos por pix são processados em poucos minutos. Ao continuar, concordo com os Termos e condições.',
            this.transacaoProtegidaTexto,
        )

        await expect(this.page.getByText('Valor mínimo: R$60', { exact: true })).toBeVisible()

        const listaValores = [
            { valor: 'R$60' },
            { valor: 'R$100' },
            { valor: 'R$250' },
            { valor: 'R$500' },
            { valor: 'R$1,000' },
            { valor: 'R$5,000' },
            { valor: 'R$10,000' },
            { valor: 'R$40,000' }
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
            'R$40,000.00',
            'Lembramos que a conta onde será feito o depósito deverá estar cadastrada no mesmo CPF.',
            this.botaoCopiarCodigoPix,
            'Voltar para Investir',
            this.transacaoProtegidaTexto,
            this.imgQRCode
        )

        const listaStepsPagamentos = [
            {
                step: '1.',
                name: 'Acesse seu internet banking'
            },
            {
                step: '2.',
                name: 'Opte por pagar via PIX.'
            },
            {
                step: '3.',
                name: 'Copie e cole o código ou digitalize-o.'
            },
            {
                step: '4.',
                name: 'Este código PIX é válido por 24 horas'
            }
        ]

        function escapeForRegex(str: string) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
        }

        for (const { step, name } of listaStepsPagamentos) {
            // buscar o step apenas quando ele aparecer no início do texto (ex.: "1." no começo)
            const escapedStep = step.replace(/\./g, '\\.')
            const stepRegex = new RegExp(`^\\s*${escapedStep}`)
            const stepLocator = this.page.getByText(stepRegex)

            // criar regex tolerante para o texto do passo (escapa caracteres especiais e aceita variações de espaço/pontuação)
            const nameRegex = new RegExp(escapeForRegex(name), 'i')
            const nameLocator = this.page.getByText(nameRegex)

            await this.assertVisible(
                stepLocator,
                nameLocator
            )
        }
    }
}