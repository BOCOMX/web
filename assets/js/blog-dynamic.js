// assets/js/blog-dynamic.js

// Función para obtener posts del blog
async function fetchBlogPosts() {
  try {
    const response = await fetch('blog.json');
    return await response.json();
  } catch (error) {
    console.error('Error cargando posts del blog:', error);
    return [];
  }
}

// Función para renderizar los posts del blog
function renderBlogPosts(posts) {
  const blogGrid = document.getElementById('blogGrid');
  if (!blogGrid) return;

  blogGrid.innerHTML = '';

  posts.forEach(post => {
    const postCard = `
      <a href="post.html?slug=${post.slug}" class="blog-card">
        <figure class="blog-card-image">
          <img src="${post.thumbnail}" alt="${post.title}">
        </figure>
        <div class="blog-card-content">
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <div class="learn-more-link">
            <span>Leer más</span>
            <i class="ri-arrow-right-line"></i>
          </div>
        </div>
      </a>
    `;
    blogGrid.innerHTML += postCard;
  });
}

// Función para inicializar la página del blog
async function initBlogPage() {
  const posts = await fetchBlogPosts();
  renderBlogPosts(posts);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Solo ejecutar si estamos en la página del blog
  if (document.querySelector('.blog-page')) {
    initBlogPage();
  }
}); 