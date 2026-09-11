import { eventoConfig } from "@/config/evento";

export function EventoJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: eventoConfig.nomeEvento,
    description: eventoConfig.descricaoCurta,
    startDate: eventoConfig.dataEventoISO,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: eventoConfig.local,
      address: eventoConfig.endereco,
    },
    organizer: {
      "@type": "Organization",
      name: eventoConfig.nomeIgreja,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/inscricao`,
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
