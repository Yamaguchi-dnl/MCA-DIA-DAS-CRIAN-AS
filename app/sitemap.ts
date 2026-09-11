import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const rotas = ["", "/inscricao", "/privacidade"];

  return rotas.map((rota) => ({
    url: `${siteUrl}${rota}`,
    lastModified: new Date(),
  }));
}
