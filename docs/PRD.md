# PRD — Painel SUS: Dashboard de Indicadores do Previne Brasil

> **Projeto:** Protótipo de Painel SUS  
> **Cliente:** Secretaria Municipal de Saúde (fictícia: Saúde Itapira)  
> **Versão:** 1.0  
> **Autor:** Owner (Agent)  
> **Data:** 2026-08-05

---

## 1. Visão Geral

Dashboard público para gestores municipais de saúde visualizarem indicadores do Previne Brasil de 15 UBS, com filtros por unidade e período, alertas visuais de desempenho e navegação acessível. Dados mockados simulam estrutura real do DATASUS/e-SUS AB.

## 2. Personas

| Persona | Perfil | Necessidade Principal |
|---------|--------|----------------------|
| **Gestor Municipal** | Secretário de Saúde, 50+ anos, baixa familiaridade tech | Ver rápido se os indicadores estão OK ou em alerta |
| **Coordenador UBS** | Enfermeiro-chefe, 35 anos, usa tablet | Acompanhar a performance da sua unidade específica |
| **Assessor Técnico** | Analista de saúde, 28 anos, usa projetor | Exportar visualização para reunião com prefeito |

## 3. Indicadores do Previne Brasil (4 selecionados)

| # | Indador | Meta | Unidade | Tendência esperada |
|---|---------|------|---------|-------------------|
| 1 | Cobertura Vacinal (Polio + Pentavalente) | ≥ 95% | % de crianças <1ano | Alta sazonal (campanhas) |
| 2 | Pré-natal (6+ consultas) | ≥ 60% | % de gestantes | Estável/alta |
| 3 | Hipertensão (PA aferida semestral) | ≥ 50% | % de hipertensos | Estável |
| 4 | Diabetes (HbA1c solicitada) | ≥ 50% | % de diabéticos | Estável |

## 4. User Stories (Gherkin)

### US-01: Visão Geral do Dashboard

**Como** gestor municipal, **quero** ver um painel com os 4 indicadores em destaque, **para** identificar rapidamente o status geral da saúde pública.

```gherkin
Cenário: Dashboard carrega com indicadores
  Dado que o usuário acessa a rota "/"
  Quando a página carrega completamente
  Então os 4 indicadores devem estar visíveis em cards
  E cada card exibe: nome do indicador, valor atual, meta, tendência
  E o indicador possui cores semáforo (verde ≥meta, amarelo 80-99% da meta, vermelho <80%)

Cenário: Dashboard sem dados mockados
  Dado que os dados mockados não estão disponíveis
  Quando a página tenta carregar
  Então uma mensagem de erro amigável deve ser exibida
  E o usuário pode tentar novamente
```

### US-02: Filtro por UBS

**Como** coordenador de UBS, **quero** filtrar os dados por unidade de saúde, **para** ver apenas a performance da minha UBS.

```gherkin
Cenário: Filtro por UBS é exibido
  Dado que o usuário está na página principal
  Quando ele observa a barra de filtros
  Então um seletor de UBS deve estar disponível com 15 opções
  E a primeira opção deve ser "Todas as UBS"

Cenário: Filtrar por UBS específica
  Dado que o usuário seleciona "UBS Vila Nova" no filtro
  Quando o dashboard atualiza
  Então todos os indicadores mostram apenas dados da UBS Vila Nova
  E o título da página ou header reflete a UBS selecionada

Cenário: Limpar filtro de UBS
  Dado que o usuário está vendo dados de uma UBS específica
  Quando ele seleciona "Todas as UBS"
  Então o dashboard volta a mostrar dados consolidados
```

### US-03: Filtro por Período

**Como** gestor, **quero** filtrar por mês ou trimestre, **para** comparar períodos diferentes.

```gherkin
Cenário: Filtro de período disponível
  Dado que o usuário está na página principal
  Quando ele observa a barra de filtros
  Então um seletor de período deve estar disponível
  E deve oferecer opções: "Último mês", "Último trimestre", "Último semestre", "Último ano"

Cenário: Mudar período reflete nos gráficos
  Dado que o período selecionado é "Último trimestre"
  Quando o dashboard atualiza
  Então o gráfico de linha mostra apenas os 3 meses do trimestre
  E os cards de indicadores mostram a média do trimestre
```

### US-04: Alertas Visuais de Indicador

**Como** gestor, **quero** identificar rapidamente indicadores em queda ou abaixo da meta, **para** tomar ação imediata.

```gherkin
Cenário: Indicador acima da meta
  Dado que o indicador de Cobertura Vacinal está em 97%
  Quando o card é renderizado
  Então a borda e ícone do card devem ser VERDES
  E um ícone de check é exibido

Cenário: Indicador entre 80-99% da meta
  Dado que o indicador de Pré-natal está em 52% (meta 60%)
  Quando o card é renderizado
  Então a borda e ícone do card devem ser AMARELOS
  E um ícone de alerta é exibido

Cenário: Indicador abaixo de 80% da meta
  Dado que o indicador de Hipertensão está em 30% (meta 50%)
  Quando o card é renderizado
  Então a borda e ícone do card devem ser VERMELHOS
  E um ícone de erro é exibido
  E uma mensagem "Abaixo da meta" aparece no card
```

### US-05: Gráfico de Linha — Série Histórica

**Como** gestor, **quero** ver a evolução do indicador nos últimos 12 meses, **para** identificar tendências.

```gherkin
Cenário: Gráfico de linha exibe 12 meses
  Dado que o usuário está na página principal
  Quando ele observa a seção de gráficos
  Então um gráfico de linha deve mostrar os 12 meses
  E a linha da meta (target) deve estar destacada como referência
  E o eixo X mostra os meses e o eixo Y mostra o percentual

Cenário: Hover no gráfico mostra detalhes
  Dado que o gráfico de linha está visível
  Quando o usuário passa o mouse sobre um ponto
  Então um tooltip deve exibir: mês, valor, meta
```

### US-06: Tabela de Ranking de UBS

**Como** gestor, **quero** ver um ranking das UBS por desempenho, **para** identificar unidades que precisam de atenção.

```gherkin
Cenário: Tabela de ranking exibe UBS
  Dado que o usuário está na página principal
  Quando ele rola até a seção de ranking
  Então uma tabela deve listar as 15 UBS
  E a tabela deve ter colunas: Posição, Nome UBS, Pontuação, Status
  E as UBS devem estar ordenadas por pontuação (melhor primeiro)

Cenário: Click na UBS do ranking vai para detalhe
  Dado que o usuário clica em uma UBS na tabela
  Quando ele clica no nome ou linha
  Então ele deve ser redirecionado para /ubs/[id] daquela unidade
```

### US-07: Página de Detalhe da UBS

**Como** coordenador, **quero** ver detalhes da minha UBS com gráfico radar e histórico, **para** fazer análise completa.

```gherkin
Cenário: Detalhe da UBS carrega corretamente
  Dado que o usuário acessa /ubs/1
  Quando a página carrega
  Então um card informativo exibe: nome, equipe, cadastrados
  E um gráfico radar mostra os 4 indicadores comparados à meta
  E uma tabela mostra o histórico mensal

Cenário: UBS inexistente mostra erro
  Dado que o usuário acessa /ubs/999
  Quando a página carrega
  Então uma mensagem "UBS não encontrada" é exibida
  E um link volta para o dashboard principal
```

### US-08: Página de Indicadores

**Como** analista, **quero** ver o detalhamento de cada indicador com séries históricas e comparativo entre UBS, **para** preparar relatório.

```gherkin
Cenário: Lista de indicadores exibe todos
  Dado que o usuário acessa /indicadores
  Quando a página carrega
  Então os 4 indicadores devem estar listados
  E cada item mostra: nome, descrição, meta atual

Cenário: Detalhe do indicador mostra comparativo
  Dado que o usuário clica no indicador "Cobertura Vacinal"
  Quando a página de detalhe carrega
  Então um gráfico de série histórica é exibido
  E uma tabela compara a performance de todas as UBS
  E a meta é destacada visualmente
```

### US-09: Página Sobre

**Como** gestor, **quero** entender a fonte dos dados e o que significam os indicadores, **para** confiar no painel.

```gherkin
Cenário: Página sobre explica fontes
  Dado que o usuário acessa /sobre
  Quando a página carrega
  Então uma explicação sobre o Previne Brasil é exibida
  E as fontes de dados são listadas (CNES, e-SUS AB, DATASUS)
  E um disclaimer indica que são dados simulados
```

### US-10: Acessibilidade (WCAG 2.1 AA)

**Como** usuário com necessidades especiais, **quero** navegar completamente via teclado, **para** usar o painel sem mouse.

```gherkin
Cenário: Navegação via Tab
  Dado que o usuário está na página principal
  Quando ele pressiona Tab repetidamente
  Então todos os elementos interativos devem receber foco
  E o foco deve ser visível (outline)

Cenário: Contraste de cores
  Dado que o dashboard está renderizado
  Quando verificamos os contrastes de cores
  Então todos os textos devem ter razão de contraste ≥ 4.5:1
  E os ícones de status devem ter contraste ≥ 3:1

Cenário: Labels em formulários
  Dado que os filtros de UBS e período estão renderizados
  Quando um leitor de tela analisa os campos
  Então cada campo deve ter um <label> associado
  E os filtros devem ter aria-label quando label visual não existe
```

### US-11: Layout Responsivo

**Como** gestor que usa tablet, **quero** que o painel se adapte ao tamanho da tela, **para** apresentar em reuniões.

```gherkin
Cenário: Layout em tablet (768px)
  Dado que o usuário abre o dashboard em tablet (768px de largura)
  Quando a página renderiza
  Então os cards de indicadores devem empilhar (2 colunas no máximo)
  E os gráficos devem ocupar largura total
  E a navegação deve ser acessível com toque

Cenário: Layout em projetor (1920px)
  Dado que o usuário abre em tela grande (1920px)
  Quando a página renderiza
  Then os cards de indicadores devem exibir em 4 colunas
  E os gráficos e tabela devem usar espaço disponível
```

### US-12: Performance de Carregamento

**Como** gestor em UBS com internet lenta, **quero** que o painel carregue rápido, **para** não desistir de usar.

```gherkin
Cenário: Carregamento inicial
  Dado que o usuário acessa o dashboard em conexão 3G simulada
  Quando a página inicia o carregamento
  Então o conteúdo principal deve aparecer em menos de 3 segundos
  E gráficos podem carregar progressivamente (Skeleton)

Cenário: Dados mockados sem chamada de rede
  Dado que os dados são mockados (import estático)
  Quando a página renderiza
  Então não deve haver chamadas HTTP para dados
  E o bundle JavaScript deve ser < 200KB (gzipped)
```

### US-13: Navegação e Estrutura de Rotas

**Como** usuário, **quero** navegar facilmente entre as páginas, **para** encontrar a informação que preciso.

```gherkin
Cenário: Navegação principal visível
  Dado que o usuário está em qualquer página
  Quando ele observa o header
  Então links de navegação para Dashboard, Indicadores e Sobre devem estar visíveis
  E o link ativo deve ter indicador visual

Cenário: Rota dinâmica para UBS
  Dado que o usuário navega para /ubs/3
  Quando a página carrega
  Então os dados da UBS com id=3 são exibidos
  E o breadcrumb mostra: Dashboard > UBS > UBS Jardim Paulista
```

### US-14: Verificação Automatizada dos Cards de Indicadores

**Como** responsável pela qualidade do painel, **quero** verificar automaticamente os estados dos cards, **para** evitar que alertas incorretos sejam apresentados aos gestores.

```gherkin
Cenário: Card mantém as informações essenciais
  Dado que existe um indicador com valor, meta, status e tendência conhecidos
  Quando a verificação automatizada do card é executada
  Então o nome, o valor atual e a meta devem ser encontrados
  E a descrição acessível deve comunicar o estado do indicador

Cenário: Card representa todos os estados de alerta
  Dado que existem indicadores nos estados verde, amarelo e vermelho
  Quando cada card é verificado automaticamente
  Então cada estado deve apresentar o ícone e a identificação visual correspondentes
  E o estado vermelho deve comunicar que o indicador está abaixo da meta
```

## 5. Regras de Negócio

| RB-01 | Status semáforo: Verde ≥ 100% da meta; Amarelo 80-99%; Vermelho < 80% |
|-------|------------------------------------------------------------------------|
| RB-02 | Ranking usa pontuação ponderada (média dos 4 indicadores, normalizada 0-100) |
| RB-03 | Período "Último mês" = último registro disponível; "Último trimestre" = média dos 3 meses mais recentes |
| RB-04 | Dados mockados cobrem 12 meses contínuos (jul/2025 a jun/2026) |
| RB-05 | Cada UBS possui entre 1.500 e 4.500 cadastrados |
| RB-06 | Valores mockados variam realisticamente (desvio padrão ≤ 15% da média) |

## 6. Fora de Escopo (v1.0)

- Autenticação / controle de acesso
- Exportação de PDF/Excel
- Integração com API real do DATASUS
- Cadastro/edição de UBS
- Notificações push
- Offline mode / Service Worker

## 7. Critérios de Aceitação Consolidados

| Critério | Valor |
|----------|-------|
| Indicadores visíveis no dashboard | 4 |
| UBS mockadas | 15 |
| Meses de histórico | 12 |
| Tempo de carregamento (3G) | < 3s |
| Contraste mínimo (texto) | 4.5:1 |
| Navegação via teclado | 100% dos elementos interativos |
| Rotas funcionais | 4 (/, /ubs/[id], /indicadores, /sobre) |
