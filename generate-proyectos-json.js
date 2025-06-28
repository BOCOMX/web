const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Función para convertir markdown a HTML (simplificada)
function markdownToHtml(markdown) {
  if (!markdown) return '';
  
  return markdown
    .replace(/\n\n/g, '</p><p>') // Dobles saltos de línea se convierten en párrafos
    .replace(/\n/g, '<br>') // Saltos simples se convierten en <br>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **texto** -> <strong>texto</strong>
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // *texto* -> <em>texto</em>
    .replace(/^(.+)$/m, '<p>$1</p>'); // Envolver en párrafos si no está ya
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
        
        // Generar slug desde el nombre del archivo
        const slug = file.replace('.md', '');
        
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
