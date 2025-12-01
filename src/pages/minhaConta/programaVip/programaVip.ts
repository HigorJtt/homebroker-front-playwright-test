import { Page, expect, Locator } from '@playwright/test'

import { ProgramaVip } from '@/src/components/navigation/minhaConta/programaVip/programaVip'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class ProgramaVipPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async abrirProgramaVip(creds: CredenciaisLogin) {
        const navigation = new ProgramaVip(this.page)
        await navigation.programaVipNavigation(creds)
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
            const locator = typeof item === 'string'
                ? this.page.getByText(item, { exact: true })
                : item
            const count = await locator.count()
            if (count === 0) continue
            for (let i = 0; i < count; i++) {
                await expect(locator.nth(i)).toBeHidden({ timeout: 5000 })
            }
        }
    }

    /* ---  Método para validar múltiplas ocorrências ---  */
    private async assertVisibleCount(texto: string, expectedCount: number): Promise<void> {
        const locator = this.page.getByText(texto, { exact: false })
        const count = await locator.count()

        if (count !== expectedCount) {
            throw new Error(`Esperado ${expectedCount} ocorrências de "${texto}", mas encontrou ${count}`)
        }

        for (let i = 0; i < count; i++) {
            await expect(locator.nth(i)).toBeVisible({ timeout: 10000 })
        }

        console.log(`Validado: "${texto}" aparece ${count}x e todas estão visíveis`)
    }

    async validarProgramaVipStandard(creds: CredenciaisLogin): Promise<void> {
        await this.abrirProgramaVip(creds)

        await this.assertVisible(
            'Programa VIP',
            'Oferecemos benefícios e recompensas exclusivas. Aproveite ofertas exclusivas, descontos personalizados e muitos outros bônus incríveis. O programa VIP é um guia confiável na sua jornada de negociação!',
            'Progresso próximo nível',
            'Confira os níveis do programa VIP que oferecemos',
        )

        /* ---  Programa Vip Standard ---*/
        await this.assertVisible(
            'Até R$2,499.99',
            'Bônus de depósito'
        )

        /* ---  Programa Vip Elite ---*/
        await this.assertVisible(
            'Elite',
            'R$2,500.00 - R$4,999.00',
            'Atendimento via WhatsApp',
            'Atendimento Prioritário',
            'Cashback: 5% semanal',
            'Conteúdos, Materiais Exclusivos e Webinares Ao Vivo',
            'Bônus de Depósito: até 100%'
        )

        /* ---  Programa Vip Infinite ---*/
        await this.assertVisible(
            'Infinite',
            'R$5,000.00 - R$19,999.00',
            'Cashback: 7% semanal',
            'Payouts Elevados: +1%',
            'Bônus de Depósito: até 200%'
        )

        /* ---  Programa Vip Black ---*/
        await this.assertVisible(
            'Black',
            'A partir de R$20,000.00',
            'desde a data de registro',
            'Consultor Exclusivo',
            'Cashback: 10% semanal',
            'Payouts Elevados: +2%',
            'Bônus de Depósito: até 300%'
        )

        await this.page.getByText('Todos benefícios Standard').isVisible()
        await this.page.getByText('Todos benefícios Elite').isVisible()
        await this.page.getByText('Todos benefícios Infinite').isVisible()

        await this.assertVisibleCount('Standard', 3)
        await this.assertVisibleCount('Saque Rápido', 3)
        await this.assertVisibleCount('Negociações sem risco', 3)
        await this.assertVisibleCount('em depósitos nos últimos 30 dias', 3)
    }

    async validarProgramaVipBlack(creds: CredenciaisLogin): Promise<void> {
        await this.abrirProgramaVip(creds)

        await this.assertVisible(
            'Programa VIP',
            'Oferecemos benefícios e recompensas exclusivas. Aproveite ofertas exclusivas, descontos personalizados e muitos outros bônus incríveis. O programa VIP é um guia confiável na sua jornada de negociação!',
            'Confira os níveis do programa VIP que oferecemos',
            'Você atingiu o nível máximo do programa VIP! Você é especial, aproveite!'
        )

        await this.assertNotVisible(
            'Progresso próximo nível'
        )

        /* ---  Programa Vip Standard ---*/
        await this.assertVisible(
            'Até R$2,499.99',
            'Bônus de depósito'
        )

        /* ---  Programa Vip Elite ---*/
        await this.assertVisible(
            'Elite',
            'R$2,500.00 - R$4,999.00',
            'Atendimento via WhatsApp',
            'Atendimento Prioritário',
            'Cashback: 5% semanal',
            'Conteúdos, Materiais Exclusivos e Webinares Ao Vivo',
            'Bônus de Depósito: até 100%'
        )

        /* ---  Programa Vip Infinite ---*/
        await this.assertVisible(
            'Infinite',
            'R$5,000.00 - R$19,999.00',
            'Cashback: 7% semanal',
            'Payouts Elevados: +1%',
            'Bônus de Depósito: até 200%'
        )

        /* ---  Programa Vip Black ---*/
        await this.assertVisible(
            'A partir de R$20,000.00',
            'desde a data de registro',
            'Consultor Exclusivo',
            'Cashback: 10% semanal',
            'Payouts Elevados: +2%',
            'Bônus de Depósito: até 300%'
        )

        await this.page.getByText('Todos benefícios Standard').isVisible()
        await this.page.getByText('Todos benefícios Elite').isVisible()
        await this.page.getByText('Todos benefícios Infinite').isVisible()

        await this.assertVisibleCount('Black', 2)
        await this.assertVisibleCount('Saque Rápido', 3)
        await this.assertVisibleCount('Negociações sem risco', 3)
        await this.assertVisibleCount('em depósitos nos últimos 30 dias', 3)
    }
}