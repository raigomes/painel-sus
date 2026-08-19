# Esclarecimentos necessários — validação do planejamento

**Status:** RESOLVIDO — 2026-08-19

A validação havia sido interrompida porque as decisões abaixo alteravam comportamento de negócio ou critérios de aceite e não podiam ser inferidas pelo Owner.

## Perguntas originalmente bloqueantes

1. Qual visualização histórica seria a fonte de verdade: linha ou barras?
2. Quais seriam os pesos dos quatro indicadores no ranking?
3. Como seriam normalização, teto e arredondamento da pontuação?
4. O detalhe de indicador seria expansível ou teria rota dinâmica?
5. O filtro usaria janelas relativas ou períodos calendário específicos?
6. Como o produto trataria ausência e invalidade dos dados locais?

## Decisões vinculantes registradas

1. A visualização histórica principal é um **gráfico de linha**.
2. O ranking usa os quatro indicadores com **peso igual de 25% cada**.
3. Cada parcela é `valor/meta × 100`, limitada ao intervalo **0–100**; a pontuação final é arredondada para **uma casa decimal**.
4. O detalhe é expansível na própria rota `/indicadores`; não existe `/indicadores/[id]`.
5. Existem somente as janelas relativas Último mês, Último trimestre, Último semestre e Último ano, ancoradas no mês mais recente presente nos dados recebidos.
6. Não existe erro artificial nem ação “Tentar novamente”; filtros sem registros produzem estado vazio com “Limpar filtros”, e dados locais inválidos são erro de desenvolvimento.

## Propagação

As seis decisões foram propagadas, nesta ordem, para:

1. `docs/PRD.md` versão 1.1;
2. `docs/SPEC.md` versão 1.1;
3. `docs/TASKS.md` reestruturado.

O blocker está encerrado e permanece neste arquivo para preservar rastreabilidade.
