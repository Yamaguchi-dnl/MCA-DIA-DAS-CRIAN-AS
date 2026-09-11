/**
 * Gera os ícones do site (favicon e ícone para tela de início no iOS) a
 * partir do logotipo em `public/fotos/`.
 *
 * Uso: node scripts/gerar-favicon.js
 */
const sharp = require("sharp");
const path = require("path");

const base = path.join(__dirname, "..");
const origem = path.join(base, "public/fotos/logotipo-vetorizado-laranja-4096.png");

const CREME = "#FFF6F0";

async function run() {
  // app/icon.png — favicon da aba do navegador. Fundo transparente, com
  // uma margem pequena para não ficar colado nas bordas em tamanhos minúsculos.
  const logoIcone = await sharp(origem)
    .resize({ width: 440, height: 440, fit: "inside" })
    .toBuffer();

  const infoIcone = await sharp({
    create: { width: 512, height: 512, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: logoIcone, gravity: "center" }])
    .png()
    .toFile(path.join(base, "app/icon.png"));
  console.log("app/icon.png", `${infoIcone.width}x${infoIcone.height}`, `${(infoIcone.size / 1024).toFixed(0)}kb`);

  // app/apple-icon.png — ícone da tela de início no iOS. Fundo sólido
  // (o iOS preenche transparência com preto), 180x180 recomendado pela Apple.
  const logoApple = await sharp(origem)
    .resize({ width: 128, height: 128, fit: "inside" })
    .toBuffer();

  const infoApple = await sharp({
    create: { width: 180, height: 180, channels: 4, background: CREME },
  })
    .composite([{ input: logoApple, gravity: "center" }])
    .png()
    .toFile(path.join(base, "app/apple-icon.png"));
  console.log("app/apple-icon.png", `${infoApple.width}x${infoApple.height}`, `${(infoApple.size / 1024).toFixed(0)}kb`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
