/**
 * Redimensiona e comprime fotos brutas de `public/fotos/` para o tamanho
 * usado na colagem da tela inicial, salvando em `public/criancas-N.jpg`.
 *
 * Uso: node scripts/otimizar-fotos.js
 */
const sharp = require("sharp");
const path = require("path");

const base = path.join(__dirname, "..");

const arquivos = [
  ["public/fotos/IMG_6695.jpg", "public/criancas-1.jpg"],
  ["public/fotos/IMG_6711.jpg", "public/criancas-2.jpg"],
  ["public/fotos/IMG_6717.jpg", "public/criancas-3.jpg"],
];

async function run() {
  for (const [origem, destino] of arquivos) {
    const origemAbs = path.join(base, origem);
    const destinoAbs = path.join(base, destino);
    const info = await sharp(origemAbs)
      .rotate()
      .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(destinoAbs);
    console.log(destino, `${info.width}x${info.height}`, `${(info.size / 1024).toFixed(0)}kb`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
