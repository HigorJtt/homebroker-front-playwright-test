import { Page, Locator, expect } from '@playwright/test'

import { Configuracoes } from '@/src/components/navigation/configuracoes/configuracoes'
import { CredenciaisLogin } from '@/src/interfaces/login.interface'

export class TermosCondicoesPage {
    readonly page: Page
    readonly termosCondicoes: Locator
    readonly titulo: Locator
    readonly descricao: Locator
    readonly alert: Locator

    constructor(page: Page) {
        this.page = page
        this.termosCondicoes = this.page.getByText('Termos e condições')
    }

    async abrirTermosCondicoes(creds: CredenciaisLogin) {
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

    async validarTermosCondicoes(creds: CredenciaisLogin) {
        await this.abrirTermosCondicoes(creds)

        await this.termosCondicoes.click()
        await this.page.waitForURL('**/pt/terms-and-conditions', { timeout: 10000 })
        await this.assertVisible('Termos e Condições de Uso da Plataforma HomeBroker')

        const listaTermos = [
            `Estes Termos e Condições (doravante referidos como “Acordo”) regulam a relação jurídica entre a HomeBroker, operando sob a marca global HomeBroker (doravante referida como “Empresa” ou “HomeBroker”), e o usuário (uma pessoa física ou jurídica) (doravante referida como “Cliente”) do site www.homebroker.com (doravante referido como “Website”).`,
            `1. Aceitação dos Termos`,
            `1.1. O Cliente confirma que leu, entendeu e aceitou todas as informações, condições e termos estabelecidos no Website, que estão abertos para revisão pública e incluem informações jurídicas importantes.`,
            `1.2. Ao aceitar este Acordo, o Cliente concorda e aceita irrevogavelmente os termos e condições contidos neste Acordo, seus anexos e/ou apêndices, bem como outros documentos/informações publicados no Website, incluindo, sem limitação, a Política de Privacidade, Política de Pagamento, Política de Retirada, Código de Conduta, Política de Execução de Pedidos e Política de Prevenção à Lavagem de Dinheiro.`,
            `1.3. O Cliente aceita este Acordo ao registrar uma Conta no Website e depositar fundos. Ao aceitar o Acordo e sujeito à aprovação final da Empresa, o Cliente entra em um acordo legal e vinculante com a Empresa.`,
            `2. Definições`,
            `2.1. Conta – significa uma conta única registrada no nome do Cliente que contém todas as transações/operações do Cliente na Plataforma de Negociação da Empresa.`,
            `2.2. Opções Binárias – instrumentos financeiros onde se faz uma previsão sobre a direção do movimento de preço de um ativo em um determinado período do dia- O pagamento é pré-determinado como um valor fixo, independentemente de a opção expirar dentro ou fora do dinheiro.`,
            `2.3. CFD (Contrato por Diferença) – contrato negociável entre o Cliente e a Empresa, que troca a diferença no valor de um Instrumento, conforme especificad- na Plataforma de Negociação no momento da abertura de uma Transação, e o valor desse Instrumento no final do contrato.`,
            `2.4. Plataforma de Negociação – sistema eletrônico na internet que consiste em todos os programas e tecnologia que apresentam cotações em tempo real, permi-em a colocação/modificação/exclusão de ordens e calculam todas as obrigações mútuas do Cliente e da Empresa.`,
            `3. Serviços`,
            `3.1. O objeto do Acordo é a prestação de Serviços ao Cliente pela Empresa sob o Acordo e através da Plataforma de Negociação.`,
            `3.2. A Empresa executará todas as transações conforme previsto neste Acordo com base apenas na execução, não gerenciando a conta nem aconselhando o Cliente.`,
            `3.3. A Empresa tem o direito de executar transações solicitadas pelo Cliente conforme previsto neste Acordo, mesmo que a transação não seja benéfica para o Cliente. A Empresa não tem obrigação, a menos que acordado de outra forma neste Acordo e/ou em outros documentos/informações no Website, de monitorar ou aconselhar o Cliente sobre o status de qualquer transação, fazer chamadas de margem ou fechar quaisquer posições abertas do Cliente.`,
            `4. Responsabilidades do Cliente`,
            `4.1. O Cliente confirma que é maior de idade e legalmente competente de acordo com a jurisdição em que reside ou é residente.`,
            `4.2. O Cliente é proibido de executar qualquer transação/operação na Plataforma de Negociação, Website e/ou através de sua Conta, que resultem em exceder o saldo total e/ou valor de dinheiro depositado/mantido em sua Conta.`,
            `4.3. O Cliente deve assegurar que o nome de usuário e senha emitidos pela Empresa para o uso dos Serviços e a Conta sejam utilizados apenas por ele/ela e não sejam divulgados a terceiros.`,
            `4.4. O Cliente se compromete a não usar scripts, bots ou qualquer outro mecanismo automatizado ou fraudulento para obter vantagem desleal ou benefício injusto na Plataforma de Negociação.`,
            `5. Uso Indevido da Plataforma`,
            `5.1. Se a Empresa detectar que o Cliente está utilizando scripts, bots ou qualquer outro mecanismo automatizado ou fraudulento para obter vantagem desleal ou benefício injusto, a Empresa reserva-se o direito de:`,
            `5.1.1. Cancelar imediatamente a conta do Cliente.`,
            `5.1.2. Reter qualquer lucro obtido através de tais práticas.`,
            `5.1.3. Negar ao Cliente acesso ao saldo disponível na plataforma, sujeito a uma investigação completa.`,
            `5.1.4. Caso tenha algum saldo após a anulação das operações financeiras, iremos restituir o valor restante.`,
            `5.2. Não serão toleradas atividades fraudulentas ou que burlem o sistema, tais como:`,
            `5.2.1. Caso seja constatado ou haja motivos para acreditar que a Conta do Cliente está sendo utilizada para benefício ou em nome de terceiros, e/ou se a pessoa estiver utilizando os Serviços para quaisquer outros efeitos além de uso pessoal e lazer (incluindo se estiver utilizando uma Conta de terceiros);`,
            `5.2.2. Se for identificado que a pessoa está depositando fundos na sua Conta sem a intenção de realizar Transações;`,
            `5.2.3. Se a pessoa estiver utilizando ou tentando utilizar uma VPN ou tecnologia semelhante para disfarçar a sua localização;`,
            `5.2.4. Se forem fornecidas informações incorretas, incompletas ou enganosas no momento do registro de uma Conta ou em momento posterior (exceto se forem fornecidas informações incorretas, incompletas ou enganosas de forma a passar verificações de idade relevantes);`,
            `5.2.6. Se for verificado que a pessoa abriu ou está utilizando uma ou mais Contas Duplicadas deliberadamente ou de forma fraudulenta;`,
            `5.2.7. Se houver razões para acreditar que a pessoa está depositando na sua Conta dinheiro proveniente de atividades criminosas e/ou ilegais.`,
            `6. Limitação de Responsabilidade`,
            `6.1. A Empresa não garante serviço ininterrupto, seguro e livre de erros, nem imunidade contra acesso não autorizado aos servidores dos sites de negociação nem interrupções causadas por danos, mau funcionamento ou falhas em hardware, software, comunicações e sistemas nos computadores do Cliente e nos fornecedores da Empresa.`,
            `6.2. A Empresa não será responsável por qualquer dano causado ao Cliente devido a eventos de força maior ou qualquer evento fora do controle da Empresa que influencie a acessibilidade do seu site de negociação.`,
            `6.3. Em caso de encerramento deste Acordo devido ao uso de mecanismos fraudulentos conforme descrito na cláusula 5, a Empresa não terá qualquer responsabilidade para com o Cliente e nenhuma obrigação de pagar os lucros do Cliente; além disso, fica a critério exclusivo da Empresa decidir se quaisquer fundos depositados serão devolvidos ao Cliente.`,
            `7. Dados Pessoais`,
            `7.1. Ao aceitar os termos e condições deste Acordo, o Cliente consente irrevogavelmente com a coleta e processamento de seus dados pessoais/informações pela Empresa, conforme fornecidos por ele/ela à Empresa.`,
            `7.2. A Empresa tomará as medidas legais, organizacionais e técnicas necessárias para proteger esses dados pessoais contra acesso não autorizado ou acidental, destruição, alteração, bloqueio, cópia, provisão e disseminação, bem como de quaisquer outras ações ilegais.`,
            `8. Direitos e Obrigações das Partes`,
            `8.1. Direitos do Cliente`,
            `8.1.1. O Cliente tem o direito de submeter qualquer ordem solicitando a execução de uma transação/Operação no Website de acordo com e sujeito aos termos e condições deste Acordo.`,
            `8.1.2. O Cliente pode solicitar a retirada de qualquer valor, sujeito e de acordo com a Política de Retirada, desde que a Empresa não tenha reivindicações contra o Cliente e/ou o Cliente não tenha dívidas pendentes com a Empresa.`,
            `8.1.3. No caso de o Cliente ter qualquer reclamação contra a Empresa e/ou houver qualquer disputa entre o Cliente e a Empresa, o Cliente pode submeter sua reclamação, incluindo todos os detalhes relevantes, à Empresa em help@homebroker.com. A Empresa acusará o recebimento de qualquer reclamação, iniciará uma investigação interna sobre o assunto e responderá ao Cliente dentro de um tempo razoável (isto é, dentro de 3 meses a partir da data de recebimento da reclamação).`,
            `8.1.4. O Cliente pode rescindir unilateralmente o Acordo, desde que não haja dívida pendente do Cliente para a Empresa e tal rescisão seja feita de acordo com a seção 16 deste Acordo.`,
            `8.2. Obrigações do Cliente`,
            `8.2.1. O Cliente se compromete a cumprir e honrar todos os termos e condições deste Acordo.`,
            `8.2.3. O Cliente deve garantir que o nome de usuário e senha emitidos pela Empresa em relação ao uso dos Serviços e da Conta sejam utilizados apenas por ele/ela e não sejam divulgados a terceiros.`,
            `8.2.4. O Cliente aceita o risco de ordens colocadas por pessoas não autorizadas e/ou contas de negociação usadas por alguém sem a permissão do Cliente (coletivamente referidos como 'acesso não autorizado' ou 'conta hackeada') e concorda em indenizar a Empresa integralmente por quaisquer perdas, custos e despesas decorrentes como resultado.`,
            `8.2.5. O Cliente deve notificar a Empresa imediatamente sobre qualquer acesso não autorizado à sua conta de negociação.`,
            `8.2.6. O Cliente reconhece que a Empresa tem o direito de bloquear imediatamente a conta de negociação do Cliente e aumentar o tempo de processamento e/ou cancelar solicitações de retirada sem notificação prévia ao Cliente, e o Cliente não terá direito a quaisquer lucros obtidos durante o tempo em que a conta foi acessada de forma não autorizada.`,
            `9. Indenização e Responsabilidade`,
            `9.1. O Cliente deve indenizar e manter a Empresa e seus diretores, funcionários, representantes ou afiliados livres de todas as responsabilidades diretas ou indiretas (incluindo, sem limitação, todas as perdas, danos, reivindicações, custos ou despesas) incorridas pela Empresa ou qualquer outro terceiro em relação a qualquer ato ou omissão pelo Cliente no desempenho de suas obrigações sob este Acordo e/ou a liquidação de quaisquer instrumentos financeiros do Cliente em liquidação de quaisquer reivindicações com a Empresa, a menos que tais responsabilidades resultem de negligência grave, dolo ou fraude pela Empresa. Esta indenização sobreviverá ao término deste Acordo.`,
            `9.2. A Empresa não será responsável por qualquer perda direta e/ou indireta, despesa, custo ou responsabilidade incorrida pelo Cliente em relação a este Acordo, a menos que tal perda, despesa, custo ou responsabilidade seja resultado de negligência grave, dolo ou fraude pela Empresa.`,
            `10. Dados Pessoais`,
            `10.1. Ao aceitar os termos e condições deste Acordo, o Cliente consente irrevogavelmente com a coleta e processamento de seus dados pessoais/informações pela Empresa, conforme fornecidos por ele/ela à Empresa.`,
            `10.2. A Empresa tomará as medidas legais, organizacionais e técnicas necessárias para proteger esses dados pessoais contra acesso não autorizado ou acidental, destruição, alteração, bloqueio, cópia, provisão e disseminação, bem como de quaisquer outras ações ilegais.`,
            `10.3. O Cliente reconhece e consente que, para os propósitos descritos acima, a Empresa tem o direito de coletar, registrar, sistematizar, acumular, armazenar, ajustar (atualizar, alterar), extrair, usar, transferir (disseminar, fornecer, acessar), anonimizar, bloquear, excluir, destruir tais dados pessoais e/ou realizar qualquer outra ação de acordo com a legislação vigente.`,
            `10.4. O Cliente reconhece e consente que a Empresa armazene, mantenha e processe seus dados pessoais na forma descrita neste Acordo durante o termo do Acordo e por um período mínimo de 7 anos após qualquer rescisão do Acordo.`,
            `10.5. O Cliente reconhece, aceita e concorda com a divulgação de dados pessoais pela Empresa a terceiros e seus representantes, exclusivamente para os fins do Acordo, incluindo, sem limitação, para facilitar o processamento/executar as ordens/operações do Cliente, desde que a quantidade de dados pessoais a serem divulgados a qualquer terceiro seja proporcional e/ou limitada exclusivamente para facilitar as ações descritas acima, e a Empresa assegurará que tal terceiro trate os dados pessoais de acordo com as leis e regulamentos aplicáveis.`,
            `11. Uso Indevido da Plataforma`,
            `11.1. Se a Empresa detectar que o Cliente está utilizando scripts, bots ou qualquer outro mecanismo automatizado ou fraudulento para obter vantagem desleal ou benefício injusto, a Empresa reserva-se o direito de:`,
            `11.1.1. Cancelar imediatamente a conta do Cliente.`,
            `11.1.2. Reter qualquer lucro obtido através de tais práticas.`,
            `11.1.3. Negar ao Cliente acesso ao saldo disponível na plataforma, sujeito a uma investigação completa.`,
            `12. Rescisão do Acordo`,
            `12.1. Este Acordo será concluído por um prazo indefinido.`,
            `12.2. Este Acordo entrará em vigor quando o Cliente aceitar o Acordo e fizer um pagamento adiantado à Empresa.`,
            `12.3. Em caso de qualquer discrepância entre o texto do Acordo em inglês e sua tradução em qualquer outra língua, o texto do Acordo em inglês prevalecerá, assim como a versão/texto em inglês de qualquer outro documento/informação publicada no Website.`,
            `12.4. Cada Parte terá o direito de rescindir este Acordo a qualquer momento, notificando a outra Parte com 15 (quinze) dias de antecedência por escrito. Durante o período de aviso de 15 dias, a Empresa poderá limitar os serviços disponíveis ao Cliente; no entanto, o acesso será concedido para que o Cliente retire qualquer saldo restante.`,
            `12.5. A Empresa terá o direito de rescindir este Acordo imediatamente, fechar todas as posições abertas, bloquear a conta do Cliente e devolver quaisquer fundos restantes (se aplicável) sem aviso prévio nas seguintes circunstâncias:`,
            `12.5.1. Morte ou incompetência legal do Cliente.`,
            `12.5.2. Se qualquer pedido for feito ou qualquer ordem for emitida, ou uma reunião for convocada, ou uma resolução for aprovada, ou quaisquer medidas de falência ou liquidação do Cliente forem tomadas.`,
            `12.5.3. Se o Cliente violar, ou a Empresa tiver motivos razoáveis para acreditar que o Cliente violou, qualquer uma das obrigações do Cliente sob e/ou termos deste Acordo e/ou estiver em violação de quaisquer garantias e representações feitas por ele/ela neste Acordo.`,
            `13. Lei Aplicável`,
            `13.1. Os termos e condições deste Acordo, bem como quaisquer questões relativas a este Acordo, incluindo, sem limitação, questões de interpretação e/ou disputas, serão regidos pelas leis.`,
            `13.2. A Empresa e os Clientes submetem-se irrevogavelmente à jurisdição dos tribunais.`,
            `14. Disposições Gerais`,
            `14.1. O Cliente concorda que a Empresa tem o direito de modificar, adicionar ou definir como padrão a taxa de pagamento de opções, a taxa de retorno, a possibilidade de ajustar a taxa de retorno, a possibilidade de adquirir o tipo de opção, o valor mínimo e/ou máximo da opção, os períodos de expiração possíveis para um, vários ou todos os ativos.`,
            `14.2. A Empresa se reserva o direito de alterar, adicionar ou definir como padrão a taxa de pagamento de opções, a taxa de retorno, a possibilidade de ajustar a taxa de retorno, a possibilidade de adquirir o tipo de opção, o valor mínimo e/ou máximo da opção, os períodos de expiração possíveis para um, vários ou todos os ativos.`,
            `14.3. A Empresa pode se recusar a executar ordens em circunstâncias que incluem, mas não se limitam a:`,
            `14.3.1. Se a execução da ordem visa ou pode visar manipular o preço de mercado dos instrumentos financeiros (manipulação de mercado);`,
            `14.3.2. Se a execução da ordem constitui ou pode constituir exploração abusiva de informações confidenciais (negociação com informação privilegiada);`,
            `14.3.3. Se a execução da ordem contribui ou pode contribuir para a legalização de proventos de atividades ilegais (lavagem de dinheiro);`,
            `14.3.4. Se o Cliente tiver fundos insuficientes para cobrir a compra de instrumentos financeiros ou se houver um número insuficiente de instrumentos financeiros para cobrir a venda;`,
            `14.3.5. Se o Cliente não cumprir qualquer uma de suas obrigações para com a Empresa sob este Acordo;`,
            `14.3.6. Se o Cliente buscar se tornar ou se tornar uma Pessoa Relatável nos EUA ou um residente dos EUA/territórios dos EUA e/ou um residente dos EUA/territórios dos EUA, Canadá, Afeganistão, Austrália, Bielorrússia, Bélgica, Ilhas Bouvet, Comores, Cuba, República Democrática do Congo, Eritreia, Etiópia, Gibraltar, Guam, Haiti, Irã, Israel, Japão, Líbia, Mali, Mianmar, Coreia do Norte, Palestina, Sudão do Sul, Sudão, Síria, Federação Russa, Reino Unido, Ucrânia, Vaticano, qualquer país da Área Econômica Europeia e/ou outros países não atendidos.`,
            `Estes Termos e Condições de Uso foram elaborados para garantir uma relação transparente e segura entre a HomeBroker e seus Clientes. Ao usar os serviços oferecidos pela HomeBroker, o Cliente concorda em cumprir estes termos e condições.`
        ]

        for (const texto of listaTermos) {
            await this.assertVisible(texto)
        }
    }
}