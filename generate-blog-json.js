const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Función para convertir markdown a HTML (simplificada)
function markdownToHtml(markdown) {
  if (!markdown) return '';
  
  return markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>') // # Título -> <h1>Título</h1>
    .replace(/^## (.*$)/gim, '<h2>$1</h2>') // ## Subtítulo -> <h2>Subtítulo</h2>
    .replace(/^### (.*$)/gim, '<h3>$1</h3>') // ### Subsubtítulo -> <h3>Subsubtítulo</h3>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **texto** -> <strong>texto</strong>
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // *texto* -> <em>texto</em>
    .replace(/\n\n/g, '<br>') // Dobles saltos de línea se convierten en un solo <br>
    .replace(/\n/g, '<br>') // Saltos simples se convierten en <br>
    .replace(/^(.+)$/m, '<p>$1</p>'); // Envolver en párrafos si no está ya
}

// Función para formatear fecha
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Función para leer y procesar archivos markdown del blog
function processBlogFiles() {
  const postsDir = path.join(__dirname, '_posts');
  const posts = [];

  try {
    const files = fs.readdirSync(postsDir);
    
    files.forEach(file => {
      if (file.endsWith('.md')) {
        const filePath = path.join(postsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const { data, content: markdownContent } = matter(content);
        
        // Generar slug desde el nombre del archivo
        const slug = file.replace('.md', '');
        
        // Convertir markdown a HTML para el contenido
        const contentHtml = markdownToHtml(markdownContent);
        
        const post = {
          id: slug, // Usar el slug como ID
          title: data.title,
          slug: slug,
          date: data.date,
          formatted_date: formatDate(data.date),
          author: data.author,
          author_avatar: data.author_avatar || '/assets/images/blog/perfil.png',
          main_image: data.main_image,
          image_2: data.image_2,
          thumbnail: data.thumbnail || data.main_image,
          excerpt: data.excerpt,
          content: markdownContent, // Mantener markdown original
          content_html: contentHtml, // Versión HTML para mostrar
          categoria: data.categoria || 'General',
          tags: data.tags || []
        };
        
        posts.push(post);
      }
    });
    
    // Ordenar por fecha (más reciente primero)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Escribir el JSON
    const jsonPath = path.join(__dirname, 'blog.json');
    fs.writeFileSync(jsonPath, JSON.stringify(posts, null, 2));
    
    console.log(`✅ Generado blog.json con ${posts.length} posts`);
    return posts;
    
  } catch (error) {
    console.error('❌ Error procesando archivos markdown del blog:', error);
    return [];
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  processBlogFiles();
}

module.exports = { processBlogFiles, markdownToHtml, formatDate }; 
