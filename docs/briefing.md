# Briefing: Prototipo de Painel SUS - UBS Modelo

> Servico: Prototipo de Painel SUS | Categoria: Lab | Preco referencia: A partir de R$ 8.000

## Cliente (Fictional)

- **Nome:** Secretaria Municipal de Saude (ficticia: Saude Itapira)
- **Ramo:** Gestao publica de saude — Atencao Primaria (UBS)
- **Porte:** 15 UBS, 40 mil habitantes cadastrados
- **Publico-alvo:** Gestores municipais de saude, coordenadores de UBS

## O Problema

O municipio precisa comprovar para o Ministerio da Saude que os indicadores do Previne Brasil (vacinacao, pre-natal, doencas cronicas) estao melhorando trimestre a trimestre. Os dados existem no sistema do Ministerio (CNES, e-SUS AB), mas sao extraidos em CSV arcaico e ninguem na secretaria consegue montar uma visualizacao decente para apresentar ao prefeito.

## A Solucao Desejada

- Prototipo funcional de dashboard com dados abertos simulados do SUS
- Visualizacao por UBS, por indicador e por periodo
- Alertas de indicadores em queda ou abaixo da meta
- Interface simples o suficiente para ser usada por um gestor sem familiaridade com tecnologia
- Nao precisa de autenticacao real — dados publicos simulados sao suficientes para o prototipo

## Requisitos Tecnicos

- Next.js + Tailwind + Shadcn/UI
- Dados mockados que simulam CSV do DATASUS (estrutura realista)
- Graficos com Recharts (barra, linha, radar para comparativo)
- Layout responsivo (pode ser apresentado em tablet ou projetor)
- Pronto para substituir dados mockados por API real no futuro
- Acessibilidade WCAG 2.1 AA (requisito de governo)

## Diferenciais para o Portfolio

- **Dados com estrutura real do SUS:** Nomenclaturas reais (CNES, equipe e-SUS, indicadores Previne Brasil)
- **Prova visual de impacto:** O gestor abre no tablet e mostra "aqui, seu excel nao faz isso"
- **Acessibilidade desde o inicio:** Nao e um "depois a gente ve" — e parte do MVP
- **PWA-ready:** Funciona em computadores antigos das UBSs

## Criterios de Sucesso

- Dashboard com 4 indicadores do Previne Brasil
- Filtro por UBS e por mes/trimestre
- Alerta visual para indicadores abaixo da meta
- Carregamento <3s em conexao 3G simulada
- Navegacao via teclado (acessibilidade)

---

## Estrutura de Paginas

```
/ (dashboard principal)
  - Mapa ou cards com resumo por UBS
  - Indicadores em destaque (verde/amarelo/vermelho)
  - Grafico de linha: variacao do indicador nos ultimos 12 meses
  - Tabela: ranking de UBSs por desempenho
/ubs/[id] (detalhe da unidade)
  - Card informativo (nome, equipe, cadastrados)
  - Grafico radar: comparativo dos indicadores
  - Tabela de historico mensal
/indicadores (detalhamento por indicador)
  - Descricao do indicador e meta
  - Serie historica
  - Comparativo com outras UBSs
/sobre (explicacao dos dados, fontes e disclaimer)

Dados Mockados:
  - 15 UBS com nomes ficticios realistas
  - 4 indicadores Previne Brasil com metas
  - 12 meses de historico
  - Valores que variam para simular tendencia
```
