const { processMarkdownFiles: processProjects } = require('./generate-proyectos-json.js');
const { processBlogFiles: processBlog } = require('./generate-blog-json.js');
const fs = require('fs');
const path = require('path');

console.log('🚀 Generando JSONs para proyectos, blog y publicidad...\n');

// Generar JSON de proyectos
console.log('📁 Procesando proyectos...');
const projects = processProjects();

// Generar JSON de blog
console.log('📝 Procesando blog...');
const posts = processBlog();

// Generar JSON de publicidad
console.log('📢 Procesando publicidad...');
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

const publicidades = getAllPublicidad();
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(publicidades, null, 2), 'utf8');
console.log(`📢 Publicidades activas generadas: ${publicidades.length}`);

console.log('\n✅ ¡Proceso completado!');
console.log(`📊 Proyectos generados: ${projects.length}`);
console.log(`📊 Posts generados: ${posts.length}`);
console.log(`📊 Publicidades activas: ${publicidades.length}`);
console.log('\n💡 Recuerda ejecutar este script cada vez que agregues nuevos archivos markdown desde tu CMS.'); 
