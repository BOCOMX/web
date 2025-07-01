const fs = require('fs');
const path = require('path');

const PUBLICIDAD_DIR = path.join(__dirname, '_publicidad');
const OUTPUT_FILE = path.join(__dirname, 'publicidad.json');

function parseFrontmatter(content) {
  const match = content.match(/^---([\s\S]*?)---/);
  if (!match) return {};
  const fm = match[1];
  const lines = fm.split('\n');
  const data = {};
  lines.forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      data[key.trim()] = rest.join(':').trim().replace(/^"|"$/g, '');
    }
  });
  return data;
}

function getAllPublicidad() {
  if (!fs.existsSync(PUBLICIDAD_DIR)) return [];
  const files = fs.readdirSync(PUBLICIDAD_DIR).filter(f => f.endsWith('.md'));
  return files.map(file => {
    const content = fs.readFileSync(path.join(PUBLICIDAD_DIR, file), 'utf8');
    const data = parseFrontmatter(content);
    return {
      imagen: data.imagen || '',
      enlace: data.enlace || '',
      activa: data.activa === 'true' || data.activa === true
    };
  }).filter(pub => pub.activa && pub.imagen && pub.enlace);
}

function main() {
  const publicidades = getAllPublicidad();
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(publicidades, null, 2), 'utf8');
  console.log(`Archivo publicidad.json generado con ${publicidades.length} publicidades activas.`);
}

main(); 