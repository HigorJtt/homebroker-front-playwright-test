import { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

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
    readonly descriiptionImportante: Locator
    readonly escolhaValorTitulo: Locator
    readonly escolhaValorDescricao: Locator
    readonly inserirCodigoTexto: Locator
    readonly codigoCupomTexto: Locator
    readonly placeholderCodigoCupom: Locator
    readonly loginBotao: Locator
    readonly termosCondicoesTexto: Locator
    readonly transacaoProtegidaTexto: Locator

    constructor(page: Page) {
        this.page = page
        /*--- Mapeamento da tela de "Selecione o tipo de depósito" ---*/
        this.titulo = this.page.getByText('Selecione o tipo de depósito')
        this.descricao = this.page.getByText('Nossa plataforma oferece uma conta de trading além da conta de prática. Cada uma opera de forma independente, com saldos e métodos de depósito separados.')
        this.tituloPix = this.page.getByText('Pix').first()
        this.valorMinimoPix = this.page.getByText('Valor mínimo: R$60.00')
        this.descricaoPix = this.page.getByText('Depósitos por pix são processados em poucos minutos')
        this.tituloCriptomoedas = this.page.getByText('Criptomoeda').first()
        this.valorMinimoCryptomoedas = this.page.getByText('Valor mínimo: 10 USDT')
        this.descriptionCriptomoedas = this.page.getByText('O tempo de processamento do depósito de criptomoeda pode variar dependendo da blockchain utilizada')
        this.descriiptionImportante = this.page.getByText('Importante: A forma de depósito é a mesma para saques. Certifique-se de selecionar a conta que corresponde ao seu método de preferência.')
        this.transacaoProtegidaTexto = this.page.getByText('Transação protegida – você está em um ambiente seguro com criptografia de 256 bits')
        /*--- Mapeamento da tela de "Escolha o valor" ---*/
        this.escolhaValorTitulo = this.page.getByText('Escolha o valor')
        this.escolhaValorDescricao = this.page.getByText('Note que todos os valores estão em real')
        this.inserirCodigoTexto = this.page.getByText('Tem um código de cupom? Insira abaixo.')
        this.codigoCupomTexto = this.page.getByLabel('Código do cupom')
        this.placeholderCodigoCupom = this.page.locator('input[placeholder="Digite o código do cupom"]')
        this.loginBotao = this.page.getByRole('button', { name: 'Aplicar' })
        this.termosCondicoesTexto = this.page.getByText('Depósitos por pix são processados em poucos minutos. Ao continuar, concordo com os ')
        this.transacaoProtegidaTexto = this.page.getByText('Transação protegida – você está em um ambiente seguro com criptografia de 256 bits')
    }

    async abrirDeposito(creds: CredenciaisLogin) {
        const navigation = new Deposito(this.page)
        await navigation.depositoNavigation(creds)
    }

    private async assertVisible(...items: Array<string | Locator>) {
        for (const item of items) {
            const locator = typeof item === 'string' ? this.page.getByText(item, { exact: true }) : item
            await expect(locator).toBeVisible({ timeout: 10000 })
        }
    }

    async validarDeposito(creds: CredenciaisLogin) {
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
            this.descriiptionImportante,
            this.transacaoProtegidaTexto
        )

        await this.tituloPix.click()
        await this.page.waitForTimeout(5000)

        await this.assertVisible(
            this.escolhaValorTitulo,
            this.escolhaValorDescricao,
            this.inserirCodigoTexto,
            this.codigoCupomTexto,
            this.loginBotao,
            this.termosCondicoesTexto,
            this.transacaoProtegidaTexto,
        )

        expect(this.placeholderCodigoCupom).toHaveAttribute('placeholder', 'Digite o código do cupom')
    }
}