import { expect } from '@playwright/test'
import { Page, Locator } from 'playwright'

import { MinhaConta } from '@/src/components/navigation/minhaConta/minhaConta.navigation'

export class MinhaContaPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async abrirMinhaConta(email: string, senha: string) {
        const minhaConta = new MinhaConta(this.page)
        await minhaConta.minhaContaNavigation(email, senha)
        return this
    }

    private async assertVisible(...items: Array<string | Locator>) {
        for (const item of items) {
            const locator = typeof item === 'string' ? this.page.getByText(item, { exact: true }) : item
            await expect(locator).toBeVisible()
        }
    }

    async validarMinhaConta(email: string, senha: string) {

        await this.abrirMinhaConta(email, senha)

        const secoes = [
            {
                nome: 'Saques',
                textos: [
                    'Saques',
                    'Retire seus fundos de forma rápida e segura',
                    'Verificação de identidade - Verificado',
                ],
            },
            {
                nome: 'Perfil',
                textos: [
                    'Perfil',
                    'Acesse suas informações pessoais',
                ],
            },
            {
                nome: 'Configurações',
                textos: [
                    'Configurações',
                    'Ajuste preferências, segurança e mais',
                ],
            },
            {
                nome: 'Visão Geral',
                textos: [
                    'Visão Geral',
                    'Saldo atual na sua conta real',
                    'O número de negociações que você fez',
                    '% de negociações lucrativas',
                    'Seu lucro total desde que você se registrou',
                ],
            },
        ]
        for (const secao of secoes) {
            await this.assertVisible(secao.nome)

            for (const texto of secao.textos) {
                await this.assertVisible(texto)
            }
        }
        return this
    }
}