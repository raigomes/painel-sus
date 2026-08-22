# PRD — Painel SUS: Dashboard de Indicadores do Previne Brasil

> **Projeto:** Protótipo de Painel SUS  
> **Cliente:** Secretaria Municipal de Saúde (fictícia: Saúde Itapira)  
> **Versão:** 1.2
> **Data:** 2026-08-22

## 1. Visão do produto

Painel público para gestores municipais acompanharem quatro indicadores do Previne Brasil em 15 UBS. O protótipo usa dados locais simulados com nomenclaturas realistas do SUS, permite consultar janelas recentes, destaca resultados abaixo da meta e funciona sem autenticação.

## 2. Público e objetivos

| Público | Objetivo |
|---|---|
| Gestor municipal | Reconhecer rapidamente indicadores e UBS que precisam de atenção |
| Coordenador de UBS | Consultar o desempenho e o histórico de sua unidade |
| Assessor técnico | Apresentar séries históricas e comparações em tablet ou projetor |

## 3. Escopo

### Incluído

- Dashboard consolidado e filtrável por UBS e janela relativa.
- Quatro indicadores: Cobertura Vacinal, Pré-natal, Hipertensão e Diabetes.
- Série histórica em gráfico de linha, com seletor de indicador iniciado em Cobertura Vacinal.
- Ranking comparativo das 15 UBS, preservado mesmo quando uma UBS é selecionada nos demais painéis.
- Detalhe de cada UBS.
- Detalhes expansíveis dos indicadores na rota `/indicadores`.
- Página sobre dados, fontes e caráter simulado.
- Navegação por teclado, contraste WCAG 2.1 AA e layout responsivo.

### Fora de escopo

- Autenticação e controle de acesso.
- Exportação de PDF, planilha ou imagem.
- Integração real com DATASUS.
- Cadastro ou edição de UBS.
- Rota `/indicadores/[id]`.
- Notificações, modo offline e Service Worker.
- Escolha de mês ou trimestre calendário específico.

## 4. Indicadores e metas

| Indicador | Meta | Unidade |
|---|---:|---|
| Cobertura Vacinal (Polio + Pentavalente) | 95% | Crianças menores de um ano |
| Pré-natal (6+ consultas) | 60% | Gestantes |
| Hipertensão (PA aferida semestralmente) | 50% | Pessoas com hipertensão |
| Diabetes (HbA1c solicitada) | 50% | Pessoas com diabetes |

## 5. User stories e cenários

### US-01 — Consultar a visão geral

**Como** gestor municipal, **quero** ver os quatro indicadores em destaque, **para** reconhecer rapidamente a situação do município.

```gherkin
Cenário: Exibir os indicadores consolidados
  Dado que o gestor acessou a rota "/"
  Quando o painel for exibido
  Então os quatro indicadores devem aparecer em cartões
  E cada cartão deve informar nome, valor, meta, tendência e estado
  E os dados iniciais devem representar o último mês disponível
```

### US-02 — Filtrar por UBS

**Como** coordenador, **quero** selecionar uma UBS, **para** consultar somente seus resultados.

```gherkin
Cenário: Selecionar uma UBS
  Dado que o gestor está vendo os dados de todas as UBS
  Quando selecionar "UBS Vila Nova"
  Então os cartões e o gráfico devem usar somente dados da UBS Vila Nova
  E o ranking deve continuar comparando as 15 UBS na janela selecionada
  E a unidade selecionada deve permanecer identificada no filtro

Cenário: Retornar ao consolidado
  Dado que uma UBS está selecionada
  Quando o gestor selecionar "Todas as UBS"
  Então os cartões e o gráfico devem voltar aos dados consolidados
  E o ranking deve continuar comparando as 15 UBS
```

### US-03 — Filtrar por janela relativa

**Como** gestor, **quero** escolher uma janela recente, **para** analisar diferentes extensões do histórico.

```gherkin
Cenário: Escolher uma janela relativa
  Dado que existem registros mensais locais
  Quando o gestor selecionar Último trimestre
  Então a janela deve incluir os três meses mais recentes presentes nos dados
  E os cartões devem apresentar a média dessa janela
  E o gráfico deve exibir os três meses da janela

Cenário: Limpar os filtros
  Dado que filtros diferentes dos padrões estão ativos
  Quando o gestor acionar "Limpar filtros"
  Então a UBS deve voltar para "Todas as UBS"
  E o período deve voltar para "Último mês"
```

### US-04 — Reconhecer alertas

**Como** gestor, **quero** distinguir resultados por estado, **para** priorizar ações.

```gherkin
Cenário: Resultado verde
  Dado que o valor alcança ou supera a meta
  Quando o cartão for exibido
  Então ele deve comunicar o estado verde com texto e ícone de confirmação

Cenário: Resultado amarelo
  Dado que o valor alcança pelo menos 80% da meta e permanece abaixo dela
  Quando o cartão for exibido
  Então ele deve comunicar o estado amarelo com texto e ícone de alerta

Cenário: Resultado vermelho
  Dado que o valor fica abaixo de 80% da meta
  Quando o cartão for exibido
  Então ele deve comunicar o estado vermelho com texto e ícone de erro
  E deve exibir a mensagem "Abaixo da meta"
```

### US-05 — Consultar a série histórica

**Como** gestor, **quero** escolher um indicador e ver sua evolução mensal em um gráfico de linha, **para** identificar tendências sem misturar medidas diferentes.

```gherkin
Cenário: Exibir a evolução inicial
  Dado que o gestor acessou o dashboard
  Quando observar a seção de evolução
  Então Cobertura Vacinal deve estar selecionada inicialmente
  E um gráfico de linha deve exibir seus meses na janela selecionada
  E uma linha de referência deve representar sua meta
  E os eixos devem identificar mês e percentual

Cenário: Escolher outro indicador no gráfico
  Dado que Cobertura Vacinal está selecionada na seção de evolução
  Quando o gestor selecionar Hipertensão
  Então o gráfico deve exibir somente a série de Hipertensão
  E a meta e o resumo textual devem corresponder à Hipertensão
  E os cartões e o ranking não devem ser alterados pela seleção do gráfico

Cenário: Consultar um ponto
  Dado que o gráfico possui dados mensais
  Quando o gestor posicionar o ponteiro ou o foco em um ponto
  Então deve receber mês, valor e meta daquele ponto
```

### US-06 — Consultar o ranking das UBS

**Como** gestor, **quero** comparar as UBS, **para** identificar unidades que precisam de atenção.

```gherkin
Cenário: Exibir ranking completo
  Dado que há dados para as 15 UBS na janela selecionada
  Quando o ranking for exibido
  Então as 15 UBS devem aparecer da maior para a menor pontuação
  E cada linha deve informar posição, UBS, equipe, pontuação e estado
  E o ranking deve permanecer municipal mesmo quando o filtro de UBS estiver ativo

Cenário: Abrir uma UBS
  Dado que o ranking está visível
  Quando o gestor ativar o nome de uma UBS
  Então deve navegar para "/ubs/[id]" da unidade escolhida
```

### US-07 — Consultar uma UBS

**Como** coordenador, **quero** consultar o perfil e o histórico da UBS, **para** analisar seu desempenho.

```gherkin
Cenário: Exibir uma UBS existente
  Dado que o coordenador acessou "/ubs/1"
  Quando a página for exibida
  Então deve ver nome, CNES, equipe, cadastrados e endereço
  E deve ver os quatro indicadores comparados às metas em gráfico radar
  E deve ver os 12 meses de histórico em tabela

Cenário: Informar UBS inexistente
  Dado que o coordenador acessou "/ubs/999"
  Quando nenhuma UBS corresponder ao identificador
  Então deve ver "UBS não encontrada"
  E deve poder voltar ao dashboard
```

### US-08 — Consultar detalhes dos indicadores

**Como** assessor técnico, **quero** expandir um indicador na página de indicadores, **para** comparar seu histórico e as UBS sem mudar de rota.

```gherkin
Cenário: Listar os indicadores
  Dado que o assessor acessou "/indicadores"
  Quando a página for exibida
  Então deve ver os quatro indicadores com descrição, meta e unidade

Cenário: Expandir um indicador
  Dado que os quatro indicadores estão listados
  Quando o assessor expandir Cobertura Vacinal
  Então deve permanecer em "/indicadores"
  E deve ver a série consolidada de 12 meses
  E deve ver as 15 UBS comparadas para esse indicador
  E a meta deve estar visualmente identificada
```

### US-09 — Entender os dados

**Como** gestor, **quero** conhecer fontes e limitações, **para** interpretar corretamente o protótipo.

```gherkin
Cenário: Exibir fontes e aviso
  Dado que o gestor acessou "/sobre"
  Quando a página for exibida
  Então deve ver uma explicação do Previne Brasil
  E deve ver CNES, e-SUS AB e DATASUS como fontes simuladas
  E deve ver que os dados são simulados para demonstração
```

### US-10 — Usar o painel com acessibilidade

**Como** pessoa que utiliza teclado ou tecnologia assistiva, **quero** compreender e operar o painel, **para** acessar as mesmas informações.

```gherkin
Cenário: Navegar por teclado
  Dado que uma rota do painel está aberta
  Quando a pessoa percorrer os controles com Tab
  Então todos os controles devem receber foco visível em ordem lógica
  E deve existir um atalho para o conteúdo principal

Cenário: Compreender estados sem depender somente de cor
  Dado que cartões e tabelas apresentam estados
  Quando uma tecnologia assistiva interpretar o conteúdo
  Então cada estado deve possuir texto ou nome acessível
  E textos devem atender contraste mínimo de 4,5 para 1
```

### US-11 — Usar diferentes telas

**Como** gestor, **quero** apresentar o painel em celular, tablet ou projetor, **para** manter a informação legível.

```gherkin
Cenário: Exibir em 375 pixels
  Dado que o painel tem 375 pixels de largura
  Quando o conteúdo for exibido
  Então os cartões devem ficar em uma coluna
  E tabelas devem permanecer acessíveis sem cortar conteúdo

Cenário: Exibir em 768 pixels
  Dado que o painel tem 768 pixels de largura
  Quando o conteúdo for exibido
  Então os cartões devem usar no máximo duas colunas
  E gráficos devem ocupar a largura disponível

Cenário: Exibir em 1920 pixels
  Dado que o painel tem 1920 pixels de largura
  Quando o conteúdo for exibido
  Então os quatro cartões devem aparecer na mesma linha
  E o conteúdo deve permanecer limitado a uma largura legível
```

### US-12 — Comunicar ausência de resultados

**Como** gestor, **quero** entender quando um filtro não possui registros, **para** voltar rapidamente a uma consulta válida.

```gherkin
Cenário: Janela filtrada sem registros
  Dado que a combinação atual de filtros não possui registros
  Quando o painel atualizar
  Então deve exibir um estado vazio informando a ausência de resultados
  E deve oferecer a ação "Limpar filtros"

Cenário: Dados locais inválidos
  Dado que os arquivos locais não atendem ao formato definido
  Quando o projeto for verificado em desenvolvimento
  Então a verificação deve falhar como erro de desenvolvimento
  E o produto não deve simular uma ação "Tentar novamente"
```

### US-13 — Navegar entre as rotas

**Como** usuário, **quero** identificar onde estou e acessar as áreas principais, **para** encontrar informações com facilidade.

```gherkin
Cenário: Exibir navegação principal
  Dado que uma rota do painel está aberta
  Quando o cabeçalho for exibido
  Então deve apresentar links para Dashboard, Indicadores e Sobre
  E o destino atual deve ser indicado por texto, sem depender somente de cor

Cenário: Exibir breadcrumb da UBS
  Dado que o usuário acessou "/ubs/3"
  Quando a UBS Jardim Paulista for exibida
  Então o breadcrumb deve informar "Dashboard > UBS > UBS Jardim Paulista"
```

## 6. Regras de negócio

| Regra | Definição |
|---|---|
| RB-01 | Verde: valor/meta ≥ 100%; amarelo: ≥ 80% e < 100%; vermelho: < 80% |
| RB-02 | A pontuação da UBS usa os quatro indicadores, cada um com peso igual de 25% |
| RB-03 | A parcela de cada indicador é `valor/meta × 100`, limitada ao intervalo 0–100 |
| RB-04 | A pontuação final é a média das quatro parcelas e é arredondada para uma casa decimal |
| RB-05 | Janelas relativas contêm 1, 3, 6 ou 12 meses e são ancoradas no mês mais recente existente nos registros recebidos |
| RB-06 | Cartões de uma janela com mais de um mês usam a média do período; consolidado municipal usa média ponderada pela população cadastrada |
| RB-07 | Dados cobrem continuamente julho de 2025 a junho de 2026: 15 UBS × 4 indicadores × 12 meses = 720 registros |
| RB-08 | Cada UBS possui entre 1.500 e 4.500 cadastrados |
| RB-09 | Para cada série UBS/indicador, o desvio padrão dos 12 valores é no máximo 15% da média da própria série |
| RB-10 | Tendência compara a média dos últimos três meses com os três anteriores: acima de +5% é alta, abaixo de -5% é queda, demais casos são estáveis |
| RB-11 | Dados locais inválidos são erro de desenvolvimento; filtros válidos sem registros produzem estado vazio com ação “Limpar filtros” |
| RB-12 | O gráfico do dashboard possui seletor próprio, inicia em Cobertura Vacinal e exibe uma única série por vez |
| RB-13 | O filtro de UBS afeta cartões e gráfico, mas não o ranking municipal; a janela relativa afeta os três |

## 7. Critérios consolidados de sucesso

- Quatro indicadores e 15 UBS disponíveis.
- Histórico contínuo de 12 meses.
- Quatro rotas funcionais: `/`, `/ubs/[id]`, `/indicadores`, `/sobre`.
- Conteúdo principal visível em menos de 3 segundos sob simulação 3G.
- Operação por teclado em todos os controles.
- Contraste WCAG 2.1 AA.
- Dados importados localmente, sem chamada HTTP para obtê-los.
