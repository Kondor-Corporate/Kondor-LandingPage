import sharp from 'sharp'
import { existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(__dirname, '../public')

const images = [
  { input: 'lucas.jpeg',  output: 'lucas.webp' },
  { input: 'joaco.jfif',  output: 'joaco.webp' },
  { input: 'nicolas.png', output: 'nicolas.webp' },
  { input: 'santi.jfif',  output: 'santi.webp' },
  { input: 'kondor.png',  output: 'kondor.webp' },
  { input: 'portfolio/maps.png',      output: 'portfolio/maps.webp' },
  { input: 'portfolio/IconoLF.png',   output: 'portfolio/IconoLF.webp' },
  { input: 'portfolio/forever.png',   output: 'portfolio/forever.webp' },
]

for (const { input, output } of images) {
  const inputPath  = resolve(publicDir, input)
  const outputPath = resolve(publicDir, output)

  if (!existsSync(inputPath)) {
    console.warn(`⚠  Skipping (not found): ${input}`)
    continue
  }

  await sharp(inputPath)
    .webp({ quality: 82, effort: 4 })
    .toFile(outputPath)

  console.log(`✅  ${input} → ${output}`)
}

// Kondor mark — Google favicon: múltiplos de 48px; URL estable para resultados de búsqueda
const logoInput = 'kondorLogo.PNG'
const logoPath = resolve(publicDir, logoInput)
if (existsSync(logoPath)) {
  const bg = { r: 18, g: 18, b: 18, alpha: 1 }
  const base = sharp(logoPath).ensureAlpha()

  await base
    .clone()
    .resize(48, 48, { fit: 'contain', background: bg })
    .webp({ quality: 90, effort: 6 })
    .toFile(resolve(publicDir, 'kondor-logo-48.webp'))

  await base
    .clone()
    .resize(96, 96, { fit: 'contain', background: bg })
    .webp({ quality: 90, effort: 6 })
    .toFile(resolve(publicDir, 'kondor-logo-96.webp'))

  await base
    .clone()
    .resize(192, 192, { fit: 'contain', background: bg })
    .webp({ quality: 90, effort: 6 })
    .toFile(resolve(publicDir, 'kondor-logo.webp'))

  await base
    .clone()
    .resize(180, 180, { fit: 'contain', background: bg })
    .webp({ quality: 90, effort: 6 })
    .toFile(resolve(publicDir, 'apple-touch-icon.webp'))

  console.log(`✅  ${logoInput} → kondor-logo-48.webp, kondor-logo-96.webp, kondor-logo.webp, apple-touch-icon.webp`)
} else {
  console.warn(`⚠  Logo not found: ${logoInput}`)
}

console.log('\nDone — WebP conversion complete.')
