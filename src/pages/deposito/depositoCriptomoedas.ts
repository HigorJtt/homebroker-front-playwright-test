import { Page, Locator, expect } from '@playwright/test'

import { Deposito } from '@/src/components/navigation/deposito/deposito'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class DepositoCriptomoedasPage {
    readonly page: Page
    readonly imgPix: Locator
    readonly tituloPix: Locator
    readonly imgCriptomoedas: Locator
    readonly tituloCriptomoedas: Locator
    readonly transacaoProtegidaTexto: Locator
    readonly escolhaValorTitulo: Locator
    readonly valorMinimoCriptomoedasEscolhaValor: Locator
    readonly placeholderCodigoCupom: Locator
    readonly aplicarBotao: Locator
    readonly selecioneCriptomoedaTitulo: Locator
    readonly selecioneCriptomoedaDescricao: Locator

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
        this.valorMinimoCriptomoedasEscolhaValor = this.page.getByText('')
        this.placeholderCodigoCupom = this.page.getByPlaceholder('Digite o código do cupom')
        this.aplicarBotao = this.page.getByRole('button', { name: 'Aplicar' })
        /*--- Mapeamento da tela de "Selecione sua criptomoeda" ---*/
        this.selecioneCriptomoedaTitulo = this.page.getByText('Selecione sua criptomoeda')
        this.selecioneCriptomoedaDescricao = this.page.getByText('Selecione um dos ativos disponíveis para fazer o depósito.')
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

        await this.tituloCriptomoedas.click()
        await expect(this.escolhaValorTitulo).toBeVisible({ timeout: 10000 })

        await this.assertVisible(
            /*--- Mapeamento da tela de "Escolha o valor" ---*/
            this.escolhaValorTitulo,
            this.imgCriptomoedas,
            'Observe que todos os valores estão em dólares americanos (USD).',
            'Valor mínimo: $10',
            'Depósitos em criptomoedas são processados em poucos minutos. Ao continuar, concordo com os Termos e condições.',
            this.transacaoProtegidaTexto
        )

        const listaValores = [
            { valor: '$50' },
            { valor: '$100' },
            { valor: '$250' },
            { valor: '$500' },
            { valor: '$1,000' },
            { valor: '$5,000' },
            { valor: '$10,000' },
            { valor: '$40,000' }
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

        await this.page.getByRole('button', { name: '$50', exact: true }).click()
        await this.page.getByRole('button', { name: 'Depósito $50.00', exact: true }).click()

        await Promise.all([
            this.selecioneCriptomoedaTitulo.waitFor({ timeout: 10000 }),
            this.selecioneCriptomoedaDescricao.waitFor({ timeout: 10000 })
        ])

        const listaCriptomoedas = [
            {
                imagem: 'Bitcoin Icon',
                nome: 'Bitcoin',
                sigla: 'BTC'
            },
            {
                imagem: 'Ethereum Icon',
                nome: 'Ethereum',
                sigla: 'ETH'
            },
            {
                imagem: 'Ethereum Icon',
                nome: 'Ethereum',
                sigla: 'ARBITRUM'
            },
            {
                imagem: 'Ethereum Icon',
                nome: 'Ethereum',
                sigla: 'BASE'
            },
            {
                imagem: 'Ethereum Icon',
                nome: 'Ethereum',
                sigla: 'BSC'
            },
            {
                imagem: 'Tether USD Icon',
                nome: 'Tether USD',
                sigla: 'BSC'
            },
            {
                imagem: 'Tether USD Icon',
                nome: 'Tether USD',
                sigla: 'ETH'
            },
            {
                imagem: 'Tether USD Icon',
                nome: 'Tether USD',
                sigla: 'MATIC'
            },
            {
                imagem: 'Tether USD Icon',
                nome: 'Tether USD',
                sigla: 'SOL'
            },
            {
                imagem: 'Tether USD Icon',
                nome: 'Tether USD',
                sigla: 'TRX'
            }
        ]

        for (const { imagem, nome, sigla } of listaCriptomoedas) {
            /* ---  pegar a primeira imagem com o alt (evita "strict mode violation" quando há múltiplas) ---*/
            const img = this.page.getByAltText(imagem, { exact: true }).first()
            await expect(img).toBeVisible({ timeout: 5000 })

            /* ---  subir ao container/tile mais próximo e validar textos separadamente ---*/
            const tile = img.locator('xpath=ancestor::button|ancestor::label|ancestor::div').first()
            await expect(tile).toBeVisible({ timeout: 5000 })

            await expect(tile.getByText(nome, { exact: true }).first()).toBeVisible({ timeout: 3000 })
            await expect(tile.getByText(sigla, { exact: true }).first()).toBeVisible({ timeout: 3000 })
        }

        await expect(this.page.getByRole('button', { name: 'Confirmar seleção', exact: true })).toBeVisible()
        await expect(this.page.getByText('Editar valor solicitado', { exact: true })).toBeVisible()
        await expect(this.page.getByText('Cancelar', { exact: true })).toBeVisible()
    }
}