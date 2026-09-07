import type { Indicator } from "@/lib/types";

export const indicatorsList: Indicator[] = [
  {
    id: "cobertura-vacinal",
    nome: "Cobertura Vacinal",
    descricao: "Percentual de crianças menores de um ano com vacinação completa para Poliomielite e Pentavalente.",
    meta: 95,
    unidade: "Crianças menores de um ano",
    fonte: "e-SUS AB / DATASUS",
  },
  {
    id: "pre-natal",
    nome: "Pré-natal",
    descricao: "Percentual de gestantes com acompanhamento de pré-natal e pelo menos seis consultas realizadas.",
    meta: 60,
    unidade: "Gestantes",
    fonte: "e-SUS AB / SISAB",
  },
  {
    id: "hipertensao",
    nome: "Hipertensão",
    descricao: "Percentual de pessoas com hipertensão arterial com pressão arterial aferida semestralmente.",
    meta: 50,
    unidade: "Pessoas com hipertensão",
    fonte: "e-SUS AB / SISAB",
  },
  {
    id: "diabetes",
    nome: "Diabetes",
    descricao: "Percentual de pessoas com diabetes com solicitação de exame de hemoglobina glicada (HbA1c).",
    meta: 50,
    unidade: "Pessoas com diabetes",
    fonte: "e-SUS AB / SISAB",
  },
];
