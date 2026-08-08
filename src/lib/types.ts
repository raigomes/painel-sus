/** Unidade Básica de Saúde */
export interface UBS {
  id: number;
  nome: string;
  codigo: string;          // Código CNES fictício (6 dígitos)
  equipe: string;          // Nome da equipe e-SUS (ex: "eSF 001")
  cadastrados: number;     // População cadastrada (1500-4500)
  endereco: string;        // Bairro/logradouro
}

/** Indicador do Previne Brasil */
export interface Indicator {
  id: string;              // ex: "cobertura-vacinal"
  nome: string;            // ex: "Cobertura Vacinal"
  descricao: string;       // Descrição completa do indicador
  meta: number;            // Meta em percentual (ex: 95)
  unidade: string;         // ex: "% de crianças <1ano"
  fonte: string;           // ex: "CNES / e-SUS AB"
}

/** Registro mensal de um indicador para uma UBS */
export interface HistoryRecord {
  ubsId: number;
  indicatorId: string;
  mes: string;             // "YYYY-MM" (ex: "2025-07")
  valor: number;           // Valor em percentual
}

/** Status semáforo de um indicador */
export type IndicatorStatus = "verde" | "amarelo" | "vermelho";

/** Período de filtro selecionado */
export type PeriodFilter = "ultimo-mes" | "ultimo-trimestre" | "ultimo-semestre" | "ultimo-ano";

/** Filtros ativos */
export interface Filters {
  ubsId: number | null;    // null = "Todas as UBS"
  period: PeriodFilter;
}

/** Dados processados para exibição no card */
export interface IndicatorDisplay {
  indicator: Indicator;
  valorAtual: number;
  status: IndicatorStatus;
  tendencia: "alta" | "estavel" | "queda";
  percentualMeta: number;  // valor / meta × 100
}

/** Linha da tabela de ranking */
export interface RankingRow {
  posicao: number;
  ubs: UBS;
  pontuacao: number;       // 0-100, média ponderada
  status: IndicatorStatus;
}

/** Dados para gráfico radar (UBS específica) */
export interface RadarDataPoint {
  indicador: string;
  valor: number;
  meta: number;
}