/**
 * Configuração central do evento.
 *
 * Este é o ÚNICO lugar que deve ser editado para trocar textos, datas,
 * contatos e imagens do site. Nada disso deve ser hardcoded em componentes
 * ou páginas.
 *
 * Valores marcados como "[A_DEFINIR...]" são placeholders e precisam ser
 * substituídos pelos dados reais antes da publicação. Nenhum dado de
 * contato ou credencial foi inventado.
 */

export const eventoConfig = {
  // Identificação do evento
  nomeEvento: "O Incrível Parque MCA",
  subtitulo: "Dia das Crianças",
  descricaoCurta:
    "Um dia muito especial preparado com carinho para as nossas crianças! Entrada gratuita — garanta a vaga da criançada.",
  descricaoCompleta:
    "Um dia muito especial preparado com carinho para as nossas crianças, com brinquedos, brincadeiras e diversão para comemorar o Dia das Crianças. Para garantir a segurança e uma boa organização, pedimos que todas as informações do formulário sejam preenchidas pelo responsável.",

  // Data, horário e local
  // Formato ISO (AAAA-MM-DD), usado no JSON-LD do evento para SEO.
  dataEventoISO: "2026-10-03",
  dataEventoExibicao: "03 de outubro de 2026 (sábado)",
  horario: "a partir das 12h",
  local: "IAP Barreirinha",
  endereco: "Rua Flávio Dallegrave, 9745, Curitiba - PR",
  linkMapa: "[A_DEFINIR: link do Google Maps, opcional]",

  // Inscrição
  gratuito: true,
  idadeMinima: 0,
  idadeMaxima: 17,
  faixaEtariaExibicao: "0 a 17 anos",
  limiteVagas: null as number | null, // null = sem limite de vagas

  // Contato
  numeroWhatsappContato: "[A_DEFINIR: número de WhatsApp da organização]",
  instagram: "[A_DEFINIR: link do Instagram]",
  emailContato: "[A_DEFINIR: e-mail de contato]",

  // Grupo de WhatsApp dos pais/responsáveis — exibido na página de
  // sucesso da inscrição, para receberem os avisos e informações do dia.
  linkGrupoWhatsappPais: "https://chat.whatsapp.com/KaBsBPpI1SkDeYJCMDtREb?mode=gi_t",

  // Identidade visual
  logo: "/logo-iap.png",
  imagemSocial: "/og-image.png",

  // Conteúdo institucional
  nomeIgreja: "IAP Barreirinha — MCA",
} as const;

export function gerarMensagemWhatsapp(nomeCrianca: string) {
  return `Olá! Tenho uma dúvida sobre a inscrição de ${nomeCrianca} no evento ${eventoConfig.nomeEvento}.`;
}

export function gerarLinkWhatsapp(nomeCrianca: string) {
  const numero = eventoConfig.numeroWhatsappContato.replace(/\D/g, "");
  if (!numero) return null;
  const mensagem = encodeURIComponent(gerarMensagemWhatsapp(nomeCrianca));
  return `https://wa.me/${numero}?text=${mensagem}`;
}
