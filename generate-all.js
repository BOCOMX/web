const { processMarkdownFiles: processProjects } = require('./generate-proyectos-json.js');
const { processBlogFiles: processBlog } = require('./generate-blog-json.js');

console.log('🚀 Generando JSONs para proyectos y blog...\n');

// Generar JSON de proyectos
console.log('📁 Procesando proyectos...');
const projects = processProjects();

// Generar JSON de blog
console.log('📝 Procesando blog...');
const posts = processBlog();

console.log('\n✅ ¡Proceso completado!');
console.log(`📊 Proyectos generados: ${projects.length}`);
console.log(`📊 Posts generados: ${posts.length}`);
console.log('\n💡 Recuerda ejecutar este script cada vez que agregues nuevos archivos markdown desde tu CMS.'); 