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
    
    // Mostrar skeleton al inicio
    const skeleton = document.getElementById('post-skeleton');
    const mainContent = document.querySelector('article.blog-post');
    if (skeleton) skeleton.style.display = 'block';
    if (mainContent) mainContent.style.display = 'none';
    
    // Cuando termina de cargar y mostrar el post:
    if (skeleton) skeleton.style.display = 'none';
    if (mainContent) mainContent.style.display = '';
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
  // Mostrar skeletons de todo al inicio
  let imageLoaded = false;

  // Función para mostrar los textos después de la imagen
  function showTextContent() {
    const skelCategory = document.getElementById('skel-category');
    const skelTitle = document.getElementById('skel-title');
    const skelDate = document.getElementById('skel-date');
    const skelContent = document.getElementById('skel-content');
    const skelAuthorImg = document.getElementById('skel-author-img');
    const skelAuthor = document.getElementById('skel-author');

    if (skelCategory) skelCategory.style.display = 'none';
    if (skelTitle) skelTitle.style.display = 'none';
    if (skelDate) skelDate.style.display = 'none';
    if (skelContent) skelContent.style.display = 'none';
    if (skelAuthorImg) skelAuthorImg.style.display = 'none';
    if (skelAuthor) skelAuthor.style.display = 'none';

    // Mostrar los elementos reales
    const authorImage = document.getElementById('authorImage');
    if (authorImage) authorImage.style.display = '';
  }

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
  const skelImg = document.getElementById('skel-img');
  if (postImage && post.main_image) {
    postImage.src = post.main_image;
    postImage.alt = post.title;
    postImage.onload = () => {
      imageLoaded = true;
      // Ocultar skeleton de imagen y mostrar imagen real
      if (skelImg) skelImg.style.display = 'none';
      postImage.style.display = '';
      // Esperar 1 segundo y mostrar los textos
      setTimeout(showTextContent, 1000);
    };
    // Si la imagen ya está en caché y cargada
    if (postImage.complete) {
      imageLoaded = true;
      if (skelImg) skelImg.style.display = 'none';
      postImage.style.display = '';
      setTimeout(showTextContent, 1000);
    }
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

  // Limpiar clases only-link
  prevLink.classList.remove('only-link');
  nextLink.classList.remove('only-link');

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

  // Si solo hay uno visible, ponerle la clase only-link
  if (!prevPost && nextPost) {
    nextLink.classList.add('only-link');
  }
  if (prevPost && !nextPost) {
    prevLink.classList.add('only-link');
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
            mostrarToast('¡Link copiado al portapapeles!');
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

function mostrarToast(mensaje) {
  let toast = document.getElementById('boco-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'boco-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '40px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'rgba(255, 103, 141, 0.95)';
    toast.style.color = '#fff';
    toast.style.padding = '1rem 2rem';
    toast.style.borderRadius = '2rem';
    toast.style.fontFamily = 'var(--font-title, Chewy, cursive)';
    toast.style.fontSize = '1.2rem';
    toast.style.boxShadow = '0 4px 24px #0002';
    toast.style.zIndex = '9999';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    toast.style.maxWidth = '90vw';
    toast.style.wordBreak = 'break-word';
    toast.style.textAlign = 'center';
    document.body.appendChild(toast);
  }
  // Adaptar estilos para móviles
  if (window.innerWidth <= 758) {
    toast.style.fontSize = '1rem';
    toast.style.padding = '0.7rem 1.2rem';
    toast.style.bottom = '80px';
    toast.style.borderRadius = '1.2rem';
    toast.style.maxWidth = '95vw';
  } else {
    toast.style.fontSize = '1.2rem';
    toast.style.padding = '1rem 2rem';
    toast.style.bottom = '40px';
    toast.style.borderRadius = '2rem';
    toast.style.maxWidth = '90vw';
  }
  toast.textContent = mensaje;
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 1800);
} 
