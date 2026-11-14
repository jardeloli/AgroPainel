# AgroPainel Sul do Maranhão

Painel do produtor rural do sul do Maranhão: clima dos municípios da região, indicador de pulverização, cadastro de talhões, diário de operações e relatório da safra.

> Trabalho da disciplina **Programação para Web**, Aula 10 (Projeto React em equipe), **Tema A**.

- **Aplicação publicada:** _colar aqui o link (Vercel, Netlify ou GitHub Pages)_
- **Repositório:** _colar aqui o link do GitHub_
- **Integrantes:** _nome 1, nome 2, nome 3_

## O que o sistema faz

| Rota | Tela | O que mostra |
| --- | --- | --- |
| `/` | Painel | Seletor de município, clima atual, previsão de 7 dias, indicador de pulverização, área total, número de talhões e próximas três colheitas |
| `/talhoes` | Talhões | Cartões com nome, cultura, área, situação e previsão de colheita; filtros por cultura, situação e busca pelo nome |
| `/talhoes/novo` | Novo talhão | Formulário de cadastro |
| `/talhoes/:id` | Detalhe | Situação, dias desde o plantio, previsão, diário de operações em ordem de data e formulário de nova operação |
| `/talhoes/:id/editar` | Editar | Mesmo formulário preenchido; exclusão com confirmação |
| `/relatorio` | Relatório | Área por cultura, custo total, custo por hectare e produção de cada talhão, com exportação em CSV |

Qualquer endereço inexistente mostra a página "não encontrada" com link para o início.

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento
npm test         # testes (Vitest)
npm run build    # verificação de tipos + build de produção
npm run preview  # servir o build localmente
```

Requer Node.js 20 ou superior.

## Publicação

O roteamento usa `HashRouter` e o `vite.config.ts` define `base: './'`, então o build da pasta `dist` funciona em qualquer hospedagem estática sem configurar redirecionamentos.

- **Vercel / Netlify:** importe o repositório; comando de build `npm run build`, pasta de saída `dist`.
- **GitHub Pages:** publique o conteúdo de `dist` (por exemplo com a action `actions/deploy-pages`).

## Estrutura (RC02)

```
src/
  componentes/   peças de interface reaproveitáveis (campos, cartões, estados, formulários)
  paginas/       uma por rota
  tipos/         interfaces e uniões literais do domínio (sem any)
  dominio/       regras de negócio como funções puras, com testes (Vitest)
  servicos/      acesso à API Open-Meteo, localStorage e utilitários com efeito colateral
  contexto/      Context + reducer do estado compartilhado
  hooks/         useTalhoes, useClima, useFocoNoErro, useTitulo
  dados/         lista fixa de municípios
```

A regra de dependência é de fora para dentro: `paginas` e `componentes` usam `dominio`; `dominio` não importa React nem toca no `localStorage`.

## Decisões de projeto

- **Regras como funções puras.** `src/dominio` recebe a **data de hoje como parâmetro** em vez de chamar `new Date()`. Assim os testes fixam `09/11/2026` e os cenários do enunciado continuam valendo em qualquer data. Só `src/servicos/utilitarios.ts` lê o relógio.
- **Datas sem erro de fuso.** Datas são texto `AAAA-MM-DD` e toda conta de dias é feita em UTC dos dois lados (`src/dominio/datas.ts`). Evita o erro de um dia por causa do fuso de Balsas.
- **Dinheiro em centavos inteiros.** O usuário digita em reais (`1.250,50`), o sistema guarda `125050`.
- **Clima sem resposta atrasada.** O hook `useClima` cancela a requisição anterior com `AbortController` na limpeza do `useEffect`. Se o usuário trocar de município rapidamente, a resposta lenta da cidade anterior nunca aparece na tela.
- **Leitura defensiva do `localStorage`.** Valor apagado, JSON quebrado ou formato inesperado resultam em um app vazio, nunca em tela branca. Itens inválidos são descartados um a um (`src/servicos/armazenamento.ts`).
- **Dados de rede como `unknown`.** A resposta da API é validada com type guards antes de virar tipo do domínio, então não há `any` explícito nem implícito.
- **Formulários controlados.** A mensagem de erro aparece ao lado do campo, o envio fica bloqueado enquanto houver erro e o foco vai para o primeiro campo inválido.
- **Diferenciais:** exportação do relatório em CSV, modo escuro automático (`prefers-color-scheme`) e página de detalhe com prazo de colheita ("faltam 9 dias").

## Checklist dos requisitos comuns

| Código | Requisito | Onde está |
| --- | --- | --- |
| RC01 | Vite `react-ts`, build sem erro, sem `any` | `npm run build`; `strict` ligado em `tsconfig.app.json` |
| RC02 | Pastas exigidas dentro de `src` | ver estrutura acima |
| RC03 | 5+ telas com `HashRouter`, rota com parâmetro, "não encontrado" | `src/App.tsx`, `src/paginas/` (7 telas) |
| RC04 | 8+ componentes com props tipadas por `interface`, 2+ reaproveitados entre telas | `src/componentes/` (19 componentes) |
| RC05 | Context com hook próprio | `src/contexto/`, `useTalhoes()` |
| RC06 | `useEffect` que depende de um valor | `useClima(municipio)` |
| RC07 | Carregando, erro com **Tentar de novo** e lista vazia | `EstadoCarregando`, `EstadoErro`, `EstadoVazio`; busca em `src/servicos/clima.ts` |
| RC08 | Formulário controlado com validação | `FormularioTalhao`, `FormularioOperacao` |
| RC09 | Persistência com leitura defensiva | `src/servicos/armazenamento.ts` |
| RC10 | Regras puras com 10+ testes em Vitest | `src/dominio/*.test.ts` (41 testes no total) |
| RC11 | Responsivo (360 px), `label` em todo campo, foco visível, teclado, contraste | `src/index.css`, componentes de campo |
| RC12 | Repositório com commits de todos, README, publicação e atribuição | este arquivo; rodapé com link para Open-Meteo.com |

## Cenários de aceitação (hoje = 09/11/2026)

Os cenários A01 a A13 estão cobertos por testes automatizados em `src/dominio/dominio.test.ts`. O A14 (troca de município) e o A15 (sem internet) dependem da tela e do hook `useClima`: ao trocar o município, o efeito roda de novo mostrando o estado de carregamento; sem conexão, o painel mostra a mensagem de erro com **Tentar de novo** e a lista de talhões segue funcionando, pois vem do `localStorage`.

## Atribuição

Dados meteorológicos: [Open-Meteo.com](https://open-meteo.com/) (API gratuita, sem chave, licença CC BY 4.0).
