const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Función para convertir markdown a HTML (mejorada)
function markdownToHtml(markdown) {
  if (!markdown) return '';

  let html = markdown;

  // Procesar blockquotes (>)
  html = html.replace(/^>\s?(.*)$/gim, '<blockquote>$1</blockquote>');

  // Procesar enlaces con {blank} para target _blank
  html = html.replace(/\[(.*?)\]\((.*?)(\s*\{blank\})?\)/g, (match, text, url, blank) => {
    if (blank) {
      return `<a href="${url}" target="_blank" rel="noopener">${text}</a>`;
    } else {
      return `<a href="${url}">${text}</a>`;
    }
  });

  // Negritas y cursivas
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
             .replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Párrafos dobles y saltos de línea
  html = html.replace(/\n\n/g, '</p><p>')
             .replace(/\n/g, '<br>');

  // Envolver en párrafos si no está ya
  html = html.replace(/^(.+)$/m, '<p>$1</p>');

  // Limpiar <p> duplicados alrededor de blockquotes
  html = html.replace(/<p>(\s*)<blockquote>/g, '<blockquote>');
  html = html.replace(/<\/blockquote>(\s*)<\/p>/g, '</blockquote>');

  return html;
}

// Función para convertir título a slug válido
function titleToSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno solo
    .trim('-'); // Remover guiones al inicio y final
}

// Función para leer y procesar archivos markdown
function processMarkdownFiles() {
  const proyectosDir = path.join(__dirname, '_proyectos');
  const proyectos = [];

  try {
    const files = fs.readdirSync(proyectosDir);
    
    files.forEach(file => {
      if (file.endsWith('.md')) {
        const filePath = path.join(proyectosDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const { data, content: markdownContent } = matter(content);
        
        // Generar slug desde el título del proyecto
        const slug = titleToSlug(data.title);
        
        // Convertir markdown a HTML para la descripción
        const descriptionHtml = markdownToHtml(data.description);
        
        // Mapear participantes a authors
        const authors = data.participants ? data.participants.map(p => ({
          name: p.name,
          avatar: p.avatar
        })) : [];
        
        const proyecto = {
          title: data.title,
          slug: slug,
          main_image: data.main_image,
          thumbnail: data.thumbnail,
          description: data.description, // Mantener markdown original
          description_html: descriptionHtml, // Versión HTML para mostrar
          gallery: data.gallery || [],
          authors: authors,
          tipo: data.tipo || 'boco',
          destacado: data.destacado || false,
          fecha: data.date || new Date().toISOString().split('T')[0],
          orden: data.orden || 999 // Campo para controlar el orden manual
        };
        
        proyectos.push(proyecto);
      }
    });
    
    // Ordenar por el campo 'orden' (menor número = primero)
    proyectos.sort((a, b) => a.orden - b.orden);
    
    // Escribir el JSON
    const jsonPath = path.join(__dirname, 'proyectos.json');
    fs.writeFileSync(jsonPath, JSON.stringify(proyectos, null, 2));
    
    console.log(`✅ Generado proyectos.json con ${proyectos.length} proyectos`);
    return proyectos;
    
  } catch (error) {
    console.error('❌ Error procesando archivos markdown:', error);
    return [];
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  processMarkdownFiles();
}

module.exports = { processMarkdownFiles, markdownToHtml }; 
