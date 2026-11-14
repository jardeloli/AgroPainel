# AgroPainel Sul do Maranhão

Painel do produtor rural do sul do Maranhão: clima dos municípios da região, indicador de pulverização, cadastro de talhões, diário de operações e relatório da safra.

> Trabalho da disciplina **Programação para Web**, Aula 10 (Projeto React em equipe), **Tema A - AgroPainel**.

- **Aplicação publicada:** _[ GitHub Pages Agro Painel)](https://jardeloli.github.io/AgroPainel/)_
- **Repositório:** _[link do GitHub](https://github.com/jardeloli)_
## Equipe

| Integrante | Responsável por |
| --- | --- |
| _Jardel Oliveira_ | _Desenv. Painel, talhões, e pagina não encontrada_ |
| _Gustavo Barros_ | _Desenv. Editar talhão_ |
| _Gustavo Noleto_ | _Desenv. Novo talhão e detalhe_ |
| _Wallaci Araújo_ | _Desenv. Relatório_ |



## Como rodar

Requisito: Node.js 20 ou superior.

```bash
npm install
npm run dev
npm test
```

Comandos adicionais:

```bash
npm run build    # verifica os tipos e gera a versão de produção em dist/
npm run preview  # executa localmente a versão gerada
npm run lint     # análise estática com Oxlint
```

## Telas

O projeto utiliza `HashRouter`. As rotas implementadas estão em `src/App.tsx`.

| Rota | Tela | Descrição |
| --- | --- | --- |
| `#/` | Painel | Seleção do município, clima atual e previsão de sete dias, indicador de pulverização, resumo da área e dos talhões e próximas colheitas. |
| `#/talhoes` | Talhões | Lista de talhões com filtros por cultura, situação e nome. |
| `#/talhoes/novo` | Novo talhão | Formulário para cadastrar um talhão. |
| `#/talhoes/:id` | Detalhe do talhão | Dados do talhão, situação da cultura, previsão de colheita e operações registradas. |
| `#/talhoes/:id/editar` | Editar talhão | Edição dos dados e opção de exclusão com confirmação. |
| `#/relatorio` | Relatório | Consolidação de área, custos e produção, com exportação em CSV. |
| `#/*` | Não encontrado | Página apresentada para endereços que não correspondem às rotas cadastradas. |

### Capturas de tela

- Tela inicial
- <img width="750" height="944" alt="image" src="https://github.com/user-attachments/assets/a697e7bb-57a4-407a-80b4-5d7d104fc59e" />

- Tela talhões
- <img width="1312" height="951" alt="image" src="https://github.com/user-attachments/assets/827dda57-487f-4b1f-8d4d-1fce99a3af94" />

- Tela novo talhão
- <img width="766" height="864" alt="image" src="https://github.com/user-attachments/assets/e382c87e-7203-4e71-ae72-956539dd6742" />

- Detalhe talhão
- <img width="751" height="947" alt="image" src="https://github.com/user-attachments/assets/c3ebdab9-1e7e-4d0f-a735-0d80a3f263bf" />

- Editar talhão
- <img width="992" height="848" alt="image" src="https://github.com/user-attachments/assets/dac5ed8b-21f1-46d9-9cae-0ee540b2e3ed" />

- Relatorio
- <img width="1067" height="856" alt="image" src="https://github.com/user-attachments/assets/1956a198-2c21-4328-8629-ceb295a32dfa" />

- Não Encontrado
- <img width="1062" height="736" alt="image" src="https://github.com/user-attachments/assets/1cebcdab-67ce-4ec5-a1b0-3efb97b56f20" />




## Regras de negócio

As regras de negócio estão concentradas em `src/dominio/`, com funções independentes da interface. As principais regras identificadas no código são:

| Regra implementada | Arquivo |
| --- | --- |
| Define o ciclo de cada cultura e calcula a previsão de colheita a partir da data de plantio. | `src/dominio/talhao.ts` |
| Determina a situação do talhão: aguardando plantio, em desenvolvimento, colheita próxima, ponto de colheita ou colhido. | `src/dominio/talhao.ts` |
| Calcula dias desde o plantio, prazo até a colheita e ordena as próximas colheitas. | `src/dominio/talhao.ts` |
| Filtra talhões por cultura, situação e nome, desconsiderando diferenças de acentuação e caixa na busca. | `src/dominio/talhao.ts` |
| Avalia condições de pulverização considerando vento, temperatura, umidade, precipitação e probabilidade de chuva. | `src/dominio/pulverizacao.ts` |
| Valida os dados do talhão, incluindo nome, cultura, município, área, data de plantio e coerência com operações já registradas. | `src/dominio/validacao.ts` |
| Valida operações agrícolas, impedindo datas futuras ou anteriores ao plantio quando aplicável, custos negativos e mais de uma colheita por talhão. | `src/dominio/validacao.ts` |
| Converte valores monetários entre reais e centavos e interpreta números digitados no formato brasileiro. | `src/dominio/dinheiro.ts` |
| Calcula produção, custos por talhão, custo por hectare e totais do relatório; também prepara os dados em CSV. | `src/dominio/relatorio.ts` |
| Valida datas e calcula intervalos e somas de dias em UTC para evitar diferenças causadas por fuso horário. | `src/dominio/datas.ts` |
| Traduz códigos meteorológicos para descrições e ícones de condição climática. | `src/dominio/clima.ts` |

A persistência e a integração externa ficam fora do domínio: `src/servicos/armazenamento.ts` valida e lê os dados do `localStorage`; `src/servicos/clima.ts` consulta e converte os dados da API meteorológica; e `src/servicos/exportacao.ts` realiza o download do CSV.

## Decisões técnicas

- **React com TypeScript e Vite:** estrutura a interface em componentes e páginas, com tipagem estática.
- **React Router com `HashRouter`:** organiza a navegação por rotas e permite publicar a aplicação em hospedagem estática sem depender de regras específicas de redirecionamento do servidor.
- **Context API e `useReducer`:** centralizam talhões, operações e município selecionado. O contexto é disponibilizado por `TalhoesProvider` e acessado pelo hook `useTalhoes`.
- **`localStorage`:** mantém os talhões e as operações no navegador. A leitura é defensiva: dados inválidos ou corrompidos são descartados, evitando que um conteúdo inconsistente impeça a abertura da aplicação.
- **Separação entre domínio e interface:** as regras ficam em funções em `src/dominio/`, sem dependência de React ou acesso direto ao armazenamento. Isso facilita os testes.
- **Vitest:** executa os testes automatizados das regras de domínio, do reducer e do serviço de clima.
- **Open-Meteo:** fornece as condições atuais e a previsão de sete dias para os municípios cadastrados. O hook `useClima` refaz a consulta quando o município muda e cancela a requisição anterior.
- **Datas e valores monetários:** datas são manipuladas como `AAAA-MM-DD` e calculadas em UTC; valores monetários são armazenados em centavos inteiros para evitar imprecisão de ponto flutuante.
- **Exportação CSV:** permite baixar o relatório com separador `;` e formatação numérica adequada ao padrão brasileiro.
- **Interface responsiva e tema:** o CSS contempla diferentes larguras de tela e respeita a preferência de tema do sistema operacional (`prefers-color-scheme`).

## Créditos

- **Open-Meteo** — API utilizada para obter dados meteorológicos atuais e previsões. Site: https://open-meteo.com/. A atribuição à fonte é exibida também no rodapé da aplicação. A licença indicada no projeto é **CC BY 4.0**.
