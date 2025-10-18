# homebroker-front-playwright-test 🚀

Repositório de testes end-to-end com Playwright para a aplicação HomeBroker (front).

Este README descreve como configurar, rodar e manter os testes, além do padrão adotado para páginas e navigation (locators/helpers).

## Sumário 📚

- [Requisitos](#requisitos-)
- [Instalação](#instalação-)
- [Como rodar os testes](#como-rodar-os-testes-)
- [Verificação rápida (TypeScript)](#verificação-rápida-typescript-)
- [Estrutura do projeto](#estrutura-do-projeto-resumida-)
- [Padrões e boas práticas](#padrão-adotado-para-page-objects-ex-loginpagets-)
- [Exemplos rápidos](#exemplos-rápidos-)
- [Contribuição](#contribuição-)
- [Problemas comuns](#problemas-comuns-)

## Requisitos ✅

- Node.js (>=16)
- npm/yarn
- Playwright (instalado via npm)

## Instalação 🛠️

```bash
# instalar dependências
npm install
# instalar navegadores (se ainda não instalou)
npx playwright install
```

## Como rodar os testes ▶️

- Rodar toda a suíte (linha de comando):

```bash
npx playwright test
```

- Rodar testes no modo UI (IDE para selecionar/rodar testes):

```bash
npx playwright test --ui
```

- Rodar um único arquivo de teste (ex.):

```bash
npx playwright test src/tests/login/login.test.ts
```

- Ver relatório em HTML (após rodar testes):

```bash
npx playwright show-report
# ou abrir o arquivo gerado em playwright-report/index.html
```

## Verificação rápida (TypeScript) 🧭

```bash
./node_modules/.bin/tsc -p tsconfig.json --noEmit
```

## Estrutura do projeto (resumida) 🗂️

- `src/pages/*` — Page objects (padrão: mapeamento de elementos e validações) 📄
- `src/components/navigation/*` — helpers de navegação (login, menus etc.) 🧭
- `src/tests/*` — arquivos de teste (Playwright Test) 🧪
- `playwright.config.ts` — configuração do Playwright ⚙️
- `playwright-report/` — relatório gerado 📊

## Padrão adotado para Page Objects (ex.: `login.page.ts`) 🧩

- Todos os locators em `page` classes são propriedades `readonly` e inicializados no `constructor`.
  - Exemplo: `readonly email: Locator`
- Helpers públicos/privados:
  - `abrir()` / `abrir<Algo>()` para centralizar navegação e checagem de título.
  - `assertVisible(...items)` para agrupar asserts de visibilidade.
  - Ações reutilizáveis: `preencherEmail`, `preencherSenha`, `submeterLogin`, `clicarEsqueciSenha`.
- Métodos retornam `this` quando faz sentido permitir encadeamento.

Benefícios: manutenção mais fácil, seletores centralizados e maior legibilidade.

## Padrão adotado para Navigation (ex.: `minhaConta.navigation.ts`) 🧭

- Navigation classes também podem expor locators `readonly` e um método principal de navegação (`navigationLogin`, `ConfiguracoesNavigation`) que:
  - executa login/navegação necessária;
  - retorna `this` para encadear chamadas;
  - valida se a página / seção foi carregada com `assertVisible`.

## Boas práticas para selectors 🔎

- Prefira seletores acessíveis: `getByRole`, `getByLabel`, `getByPlaceholder` quando possível.
- Evite depender de classes geradas dinamicamente.
- Use `data-testid` se a aplicação fornecer (mais estável).
- Para textos, use `getByText(text, { exact: true })` quando desejar match exato.

## Exemplos rápidos ✨

- Validar placeholders (no teste ou page):

```ts
await loginPage.validarPlaceholders()
// ou diretamente
await expect(loginPage.email).toHaveAttribute('placeholder', 'Digite seu e-mail')
```

## Executar apenas um teste com trace/slowmo (útil para debug) 🐞

```bash
npx playwright test --trace on --timeout 60000
npx playwright test --project=chromium --headed --debug
```

## Contribuição 🤝

- Mantenha o padrão de locators `readonly` e helpers.
- Adicione testes pequenos e herméticos (isolados)
- Atualize o README se adicionar novas convenções ou utilitários.

## Problemas comuns ⚠️

- Se um locator parar de funcionar, verifique selector no DOM e prefira `data-testid`.
- Para problemas de tempo/assincronismo, use `await expect(locator).toBeVisible({ timeout: 10000 })`.