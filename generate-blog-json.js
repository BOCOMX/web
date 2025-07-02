const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Conversión manual mejorada de markdown a HTML
function markdownToHtml(markdown) {
  if (!markdown) return '';

  // Procesar títulos
  let html = markdown
    .replace(/^### (.*)$/gim, '<h3>$1</h3>')
    .replace(/^## (.*)$/gim, '<h2>$1</h2>')
    .replace(/^# (.*)$/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Procesar listas no ordenadas
  html = html.replace(/(^|\n)[ ]*\* (.*?)(?=\n|$)/g, (match, p1, p2) => `${p1}<li>${p2}</li>`);
  // Agrupar <li> en <ul>
  html = html.replace(/(<li>.*?<\/li>\s*)+/g, match => `<ul>${match.replace(/\n/g, '')}</ul>`);

  // Procesar listas ordenadas
  html = html.replace(/(^|\n)[ ]*\d+\. (.*?)(?=\n|$)/g, (match, p1, p2) => `${p1}<li>${p2}</li>`);
  html = html.replace(/(<li>.*?<\/li>\s*)+/g, match => `<ol>${match.replace(/\n/g, '')}</ol>`);

  // Procesar párrafos (líneas que no son títulos ni listas)
  html = html.replace(/(^|\n)(?!<h\d|<ul>|<ol>|<li>|<\/ul>|<\/ol>|<\/li>|<p>|<\/p>)([^<\n][^\n]*)/g, (m, p1, p2) => `<p>${p2.trim()}</p>`);

  // Limpiar <p> duplicados alrededor de listas y títulos
  html = html.replace(/<p>(\s*)<(h\d|ul|ol)>/g, '<$2>');
  html = html.replace(/<\/(h\d|ul|ol)>(\s*)<\/p>/g, '</$1>');

  return html;
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
        
        // Generar slug desde el título del post
        const slug = titleToSlug(data.title);
        
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
