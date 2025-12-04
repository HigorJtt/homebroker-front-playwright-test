import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class PoliticaPrivacidadePage {
    readonly page: Page
    readonly politicaPrivacidade: Locator

    constructor(page: Page) {
        this.page = page
        this.politicaPrivacidade = this.page.getByText('Política de privacidade')
    }

    async abrirPoliticaPrivacidade(creds: CredenciaisLogin) {
        const navigation = new Configuracoes(this.page)
        await navigation.configuracoesNavigation(creds)
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

    async validarPoliticaPrivacidade(creds: CredenciaisLogin) {
        await this.abrirPoliticaPrivacidade(creds)

        await this.politicaPrivacidade.click()
        await this.page.waitForTimeout(5000)
        await this.page.waitForURL('**/pt/privacy-policy', { timeout: 10000 })
        await this.assertVisible('Política de Privacidade')

        const listaPolitica = [
            `1. Introdução`,
            `Esta Política de Privacidade descreve como a HomeBroker (“Empresa”, “nós” ou “nosso”), coleta, usa, armazena, divulga e protege as informações pessoais dos usuários (“Cliente” ou “você”) ao utilizar os serviços oferecidos através do site www.homebroker.com (“Website”).`,
            `2. Coleta de Informações`,
            `2.1. Informações Fornecidas pelo Cliente: Durante o registro, ao criar uma conta ou utilizar nossos serviços, coletamos informações como nome, endereço de e-mail, número de telefone, informações de pagamento e outros dados necessários para a prestação dos serviços.`,
            `2.2. Informações de Navegação: Coletamos informações automaticamente sobre sua interação com o Website, incluindo o endereço IP, tipo de navegador, páginas visitadas, duração da visita e outras estatísticas de uso.`,
            `2.3. Cookies: Utilizamos cookies e tecnologias similares para melhorar a experiência do usuário, analisar o tráfego do Website e personalizar o conteúdo. Você pode configurar seu navegador para recusar cookies, mas isso pode afetar a funcionalidade do Website.`,
            `3. Uso das Informações`,
            `3.1. Prestação de Serviços: Utilizamos as informações coletadas para registrar sua conta, processar transações, fornecer suporte ao cliente e cumprir nossas obrigações contratuais com você.`,
            `3.2. Comunicações: Podemos usar suas informações de contato para enviar notificações importantes, atualizações, materiais promocionais e outras comunicações relacionadas aos serviços.`,
            `3.3. Personalização: Usamos os dados para personalizar sua experiência no Website, como recomendar produtos ou serviços que possam ser de seu interesse.`,
            `3.4. Análise e Melhorias: Analisamos dados agregados e desidentificados para entender tendências de uso e melhorar nossos serviços e a experiência do usuário.`,
            `4. Compartilhamento de Informações`,
            `4.1. Com Terceiros: Podemos compartilhar suas informações pessoais com terceiros para facilitar a prestação de serviços, como processadores de pagamento, prestadores de serviços de TI e outros parceiros necessários. Esses terceiros são obrigados a proteger seus dados de acordo com esta Política de Privacidade.`,
            `4.2. Obrigação Legal: Podemos divulgar suas informações pessoais se exigido por lei ou em resposta a solicitações válidas de autoridades governamentais ou judiciais.`,
            `4.3. Transferências de Negócios: Em caso de fusão, aquisição ou venda de ativos, suas informações pessoais podem ser transferidas como parte dessa transação. Notificaremos qualquer mudança de propriedade ou uso das suas informações pessoais.`,
            `5. Segurança das Informações`,
            `Implementamos medidas técnicas e organizacionais adequadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro, e não podemos garantir segurança absoluta.`,
            `6. Retenção de Dados`,
            `Manteremos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos para os quais foram coletadas, incluindo a conformidade com obrigações legais, contábeis ou de relatórios. Normalmente, armazenamos suas informações por um período mínimo de 7 anos após o encerramento de sua conta.`,
            `7. Direitos do Cliente`,
            `7.1. Acesso e Correção: Você tem o direito de acessar suas informações pessoais e solicitar a correção de quaisquer dados incorretos ou desatualizados.`,
            `7.2. Retirada de Consentimento: Você pode retirar seu consentimento para o uso de seus dados pessoais a qualquer momento, exceto quando necessário para cumprir obrigações contratuais ou legais.`,
            `7.3. Exclusão de Dados: Você pode solicitar a exclusão de suas informações pessoais, sujeitas a certas exceções, como quando os dados são necessários para o cumprimento de obrigações legais.`,
            `8. Transferências Internacionais de Dados`,
            `As informações pessoais que coletamos podem ser transferidas e armazenadas em servidores localizados fora do seu país de residência, inclusive em países que podem não ter leis de proteção de dados equivalentes. Tomaremos todas as medidas razoavelmente necessárias para garantir que seus dados sejam tratados com segurança e de acordo com esta Política de Privacidade.`,
            `9. Alterações na Política de Privacidade`,
            `Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas de tratamento de dados. Quaisquer alterações serão publicadas no Website e, quando apropriado, notificaremos você através do e-mail registrado. O uso continuado do Website após tais alterações constitui aceitação dos novos termos.`,
            `10. Contato`,
            `Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou sobre nossas práticas de privacidade, entre em contato conosco através do e-mail: help@homebroker.com.`,
            `11. Legislação Aplicável`,
            `Esta Política de Privacidade é regida pelas leis. Qualquer disputa relacionada à privacidade estará sujeita à jurisdição dos tribunais.`
        ]

        for (const texto of listaPolitica) {
            await this.assertVisible(texto)
        }
    }
}