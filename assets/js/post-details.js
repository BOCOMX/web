// assets/js/post-details.js

// Función para obtener parámetros de la URL
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

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

// Función para cargar los detalles del post
async function loadPostDetails() {
  const slug = getUrlParameter('slug');
  
  if (!slug) {
    showError('No se proporcionó un slug de post');
    return;
  }

  try {
    const posts = await fetchBlogPosts();
    const postIndex = posts.findIndex(p => p.slug === slug);
    const post = posts[postIndex];
    
    if (!post) {
      showError('Post no encontrado');
      return;
    }

    updatePostContent(post);
    loadRelatedPosts(post.slug, posts);
    updatePostNavigation(posts, postIndex);
    
  } catch (error) {
    console.error('Error al cargar los detalles del post:', error);
    showError('Error al cargar el post');
  }
}

// Función para mostrar mensaje de error
function showError(message) {
  const errorDiv = document.getElementById('error-message');
  const mainContent = document.querySelector('.blog-post');
  
  if (errorDiv) {
    errorDiv.style.display = 'block';
    if (mainContent) {
      mainContent.style.display = 'none';
    }
  }
}

// Función para actualizar el contenido del post
function updatePostContent(post) {
  // Actualizar título de la página
  document.title = `${post.title} - BOCO Blog`;
  
  // Actualizar meta tags
  updateMetaTags(post);
  
  // Actualizar título del post
  const postTitle = document.getElementById('postTitle');
  if (postTitle) {
    postTitle.textContent = post.title;
  }
  
  // Actualizar fecha
  const postDate = document.getElementById('postDate');
  if (postDate) {
    postDate.textContent = post.formatted_date;
  }
  
  // Actualizar imagen principal
  const postImage = document.getElementById('postImage');
  if (postImage && post.main_image) {
    postImage.src = post.main_image;
    postImage.alt = post.title;
  }
  
  // Actualizar contenido del post
  const postContent = document.getElementById('postContent');
  if (postContent && post.content_html) {
    postContent.innerHTML = post.content_html;
  }
  
  // Actualizar autor
  const authorName = document.getElementById('authorName');
  const authorImage = document.getElementById('authorImage');
  if (authorName) {
    authorName.textContent = post.author;
  }
  if (authorImage && post.author_avatar) {
    authorImage.src = post.author_avatar;
    authorImage.alt = post.author;
  }
  
  // Actualizar categoría
  const postCategory = document.getElementById('postCategory');
  if (postCategory) {
    postCategory.textContent = post.categoria;
  }
}

// Función para actualizar meta tags
function updateMetaTags(post) {
  // Actualizar meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.content = post.excerpt;
  }
  
  // Actualizar og:title
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.content = post.title;
  }
  
  // Actualizar og:description
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.content = post.excerpt;
  }
  
  // Actualizar og:image
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage && post.main_image) {
    ogImage.content = post.main_image;
  }
}

// Función para cargar posts relacionados
function loadRelatedPosts(currentSlug, allPosts) {
  // Filtrar posts (excluir el actual y tomar solo 3)
  const relatedPosts = allPosts
    .filter(p => p.slug !== currentSlug)
    .slice(0, 3);
  
  const relatedGrid = document.querySelector('.related-posts-grid');
  if (relatedGrid) {
    relatedGrid.innerHTML = relatedPosts.map(post => `
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
    `).join('');
  }
}

// Función para actualizar la navegación entre posts
function updatePostNavigation(posts, currentIndex) {
  const prevPost = posts[currentIndex - 1];
  const nextPost = posts[currentIndex + 1];

  const prevLink = document.getElementById('prevPost');
  const nextLink = document.getElementById('nextPost');

  // Anterior
  if (prevPost) {
    prevLink.style.display = '';
    prevLink.href = `post.html?slug=${prevPost.slug}`;
    prevLink.querySelector('h4').textContent = prevPost.title;
  } else {
    prevLink.style.display = 'none';
  }

  // Siguiente
  if (nextPost) {
    nextLink.style.display = '';
    nextLink.href = `post.html?slug=${nextPost.slug}`;
    nextLink.querySelector('h4').textContent = nextPost.title;
  } else {
    nextLink.style.display = 'none';
  }

  // Alinear a la izquierda si solo hay un enlace visible
  const navLinks = document.querySelectorAll('.post-navigation .nav-link');
  navLinks.forEach(link => link.classList.remove('only-link'));
  const visibles = Array.from(navLinks).filter(link => link.style.display !== 'none');
  if (visibles.length === 1) {
    visibles[0].classList.add('only-link');
  }
}

// Función para manejar botones de compartir
function initShareButtons() {
  const shareButtons = document.querySelectorAll('.share-btn');
  
  shareButtons.forEach(button => {
    button.addEventListener('click', function() {
      const platform = this.dataset.platform;
      const url = window.location.href;
      const title = document.title;
      
      switch(platform) {
        case 'copy':
          navigator.clipboard.writeText(url).then(() => {
            alert('¡Link copiado al portapapeles!');
          });
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
          break;
      }
    });
  });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Solo ejecutar si estamos en la página de post
  if (document.querySelector('.blog-post-page')) {
    loadPostDetails();
    initShareButtons();
  }
}); 
