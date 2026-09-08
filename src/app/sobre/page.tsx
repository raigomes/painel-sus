import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre - Painel SUS",
};

export default function SobrePage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] bg-zinc-50 px-4 sm:px-8 py-6">
      <header className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold leading-tight text-zinc-900">
          Sobre o Painel SUS
        </h1>
          <p className="text-sm leading-relaxed text-zinc-500">
          Entenda o objetivo deste protótipo e como os dados são
          apresentados.
        </p>
      </header>

      <article className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">
            O que é o Previne Brasil?
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600">
            O Previne Brasil é o programa de financiamento federal para a
            Atenção Primária à Saúde, instituído pela Portaria GM/MS nº
            3.493/2019. O programa substitui o Piso Fixo e variável da
            Atenção Básica por um modelo de pagamento baseado em indicadores
            de saúde, incentivando práticas voltadas à promoção da saúde,
            prevenção de doenças e ao cuidado centrado nas necessidades da
            população.
          </p>
          <p className="text-sm leading-relaxed text-zinc-600">
            Os indicadores do Previne Brasil são monitorados por meio do
            Cadastro Nacional de Estabelecimentos de Saúde (CNES), do
            Sistema de Informação em Saúde para a Atenção Básica (e-SUS AB)
            e do DATASUS, que fornecem os dados de cobertura vacinal,
            pré-natal, hipertensão e diabetes utilizados neste painel.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">
            Objetivo deste protótipo
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600">
            Este painel é um protótipo interativo criado para demonstrar
            como os indicadores do Previne Brasil podem ser visualizados
            de forma clara e acessível, facilitando o acompanhamento dos
            resultados de cada Unidade Básica de Saúde (UBS) no município
            de Itapira.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">
            Dados simulados
          </h2>
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
            <p className="text-sm font-medium leading-relaxed text-amber-800">
              Aviso: Todos os dados exibidos neste painel são simulados
              para fins de demonstração. Os valores não representam dados
              reais de nenhuma Unidade Básica de Saúde e não devem ser
              utilizados para tomada de decisão clínica ou administrativa.
            </p>
          </div>
          <p className="text-sm leading-relaxed text-zinc-600">
            Os dados foram gerados artificialmente seguindo a estrutura e
            as faixas de valores esperadas para os indicadores do Previne
            Brasil. As UBS, endereços e códigos CNES são fictícios e
            criados exclusivamente para fins de teste da interface.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">
            Fontes de dados
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600">
            Os dados reais do Previne Brasil são obtidos a partir das
            seguintes fontes oficiais do Sistema Único de Saúde (SUS):
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-zinc-600">
            <li>
              <strong className="font-medium text-zinc-800">CNES</strong>{" "}
              &mdash; Cadastro Nacional de Estabelecimentos de Saúde:
              registra e identifica os estabelecimentos de saúde em
              território nacional, fornecendo informações sobre
              estrutura, equipe e capacidade instalada.
            </li>
            <li>
              <strong className="font-medium text-zinc-800">
                e-SUS AB
              </strong>{" "}
              &mdash; Sistema de Informação em Saúde para a Atenção
              Básica: registra as ações e os atendimentos realizados nas
              Unidades Básicas de Saúde, alimentando os indicadores de
              cobertura e desempenho.
            </li>
            <li>
              <strong className="font-medium text-zinc-800">
                DATASUS
              </strong>{" "}
              &mdash; Departamento de Informática do SUS: centraliza e
              disponibiliza os dados de saúde do país, incluindo
              mortalidade, morbidade e informações assistenciais para
             planejamento e controle.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">
            Indicadores monitorados
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600">
            Este painel acompanha quatro indicadores fundamentais do
            Previne Brasil:
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-zinc-600">
            <li>
              <strong className="font-medium text-zinc-800">
                Cobertura Vacinal
              </strong>{" "}
              &mdash; Percentual da população-alvo vacinada conforme
              calendário do Programa Nacional de Imunizações.
            </li>
            <li>
              <strong className="font-medium text-zinc-800">
                Pré-natal
              </strong>{" "}
              &mdash; Proporção de gestantes com pelo menos seis
              consultas pré-natal realizadas.
            </li>
            <li>
              <strong className="font-medium text-zinc-800">
                Hipertensão
              </strong>{" "}
              &mdash; Proporção de pessoas com hipertensão que realizaram
              aferição da pressão arterial.
            </li>
            <li>
              <strong className="font-medium text-zinc-800">
                Diabetes
              </strong>{" "}
              &mdash; Proporção de pessoas com diabetes que realizaram
              solicitação de hemoglobina glicada.
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
}
