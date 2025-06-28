// assets/js/home-dynamic.js

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

// Función para obtener proyectos
async function fetchProjects() {
  try {
    const response = await fetch('proyectos.json');
    return await response.json();
  } catch (error) {
    console.error('Error cargando proyectos:', error);
    return [];
  }
}

// Función para renderizar los 3 posts más recientes del blog
function renderRecentBlogPosts(posts) {
  const blogGrid = document.querySelector('#blog .blog-grid');
  if (!blogGrid) return;

  // Tomar solo los 3 más recientes
  const recentPosts = posts.slice(0, 3);
  
  blogGrid.innerHTML = recentPosts.map(post => `
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

// Función para renderizar proyectos destacados
function renderFeaturedProjects(projects) {
  const projectsSlider = document.querySelector('#proyectos .swiper-wrapper');
  if (!projectsSlider) return;

  // Filtrar solo los proyectos destacados
  const featuredProjects = projects.filter(p => p.destacado === true);
  
  projectsSlider.innerHTML = featuredProjects.map(project => `
    <div class="swiper-slide">
      <a href="detalles.html?slug=${project.slug}" class="project-card">
        <figure class="project-card-image">
          <img src="${project.thumbnail}" alt="${project.title}">
          <div class="project-authors">
            ${project.authors.map(author => 
              `<img src="${author.avatar}" alt="${author.name}">`
            ).join('')}
          </div>
        </figure>
        <div class="project-card-content">
          <h3>${project.title}</h3>
        </div>
      </a>
    </div>
  `).join('');

  // Reinicializar Swiper si existe
  if (window.projectsSwiper) {
    window.projectsSwiper.update();
  }
}

// Función para inicializar la página de inicio
async function initHomePage() {
  try {
    // Cargar posts y proyectos en paralelo
    const [posts, projects] = await Promise.all([
      fetchBlogPosts(),
      fetchProjects()
    ]);

    // Renderizar contenido
    renderRecentBlogPosts(posts);
    renderFeaturedProjects(projects);

  } catch (error) {
    console.error('Error inicializando página de inicio:', error);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Solo ejecutar si estamos en la página de inicio
  if (document.querySelector('.home-page') || window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
    initHomePage();
  }
}); 