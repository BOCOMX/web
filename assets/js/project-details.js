// assets/js/project-details.js

// Función para obtener parámetros de la URL
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Función para cargar los detalles del proyecto
async function loadProjectDetails() {
  const slug = getUrlParameter('slug');
  
  if (!slug) {
    showError('No se proporcionó un slug de proyecto');
    return;
  }

  try {
    // Cargar todos los proyectos
    const response = await fetch('proyectos.json');
    const projects = await response.json();
    
    // Encontrar el proyecto por slug
    const project = projects.find(p => p.slug === slug);
    
    if (!project) {
      showError('Proyecto no encontrado');
      return;
    }

    // Actualizar el contenido de la página
    updatePageContent(project);
    
  } catch (error) {
    console.error('Error al cargar los detalles del proyecto:', error);
    showError('Error al cargar el proyecto');
  }
}

// Función para actualizar el contenido de la página
function updatePageContent(project) {
  // Actualizar título de la página
  document.title = `${project.title} - BOCO`;
  
  // Actualizar título principal
  const heroTitle = document.querySelector('.pd-hero-title');
  if (heroTitle) {
    heroTitle.textContent = project.title;
  }
  
  // Actualizar imagen principal
  const heroImg = document.querySelector('.pd-hero-img');
  if (heroImg && project.main_image) {
    heroImg.src = project.main_image;
    heroImg.alt = `Imagen principal de ${project.title}`;
  }
  
  // Actualizar avatares de autores
  const avatarsList = document.querySelector('.pd-avatars-list');
  if (avatarsList && project.authors) {
    avatarsList.innerHTML = project.authors.map(author => `
      <div class="pd-avatar-item">
        <img src="${author.avatar}" alt="${author.name}" class="pd-avatar-img">
        <span class="pd-avatar-name">${author.name}</span>
      </div>
    `).join('');
  }
  
  // Actualizar descripción del proyecto
  const descElement = document.querySelector('.pd-desc');
  if (descElement && project.description_html) {
    // Usar la versión HTML ya convertida desde markdown
    descElement.innerHTML = project.description_html;
  } else if (descElement && project.description) {
    // Fallback: convertir markdown básico si no hay HTML
    const formattedDescription = project.description.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
    descElement.innerHTML = `<p>${formattedDescription}</p>`;
  }
  
  // Actualizar galería de fotos
  if (project.gallery && project.gallery.length > 0) {
    updateGallery(project.gallery);
  }
  
  // Actualizar sección "Más proyectos"
  loadMoreProjects(project.slug);
}

// Función para actualizar la galería
function updateGallery(gallery) {
  // Actualizar galería de escritorio
  const desktopGallery = document.querySelector('.pd-gallery-grid');
  if (desktopGallery) {
    desktopGallery.innerHTML = gallery.map(item => `
      <img src="${item.image}" alt="Foto del proyecto" class="pd-gallery-img">
    `).join('');
  }
  
  // Actualizar slider móvil
  const mobileSlider = document.querySelector('.pd-gallery-slider .swiper-wrapper');
  if (mobileSlider) {
    mobileSlider.innerHTML = gallery.map(item => `
      <div class="swiper-slide">
        <img src="${item.image}" alt="Foto del proyecto" class="pd-gallery-img">
      </div>
    `).join('');
  }
  
  // Reinicializar Swiper para que la paginación coincida
  if (window.swiper) {
    window.swiper.destroy(true, true);
  }
  window.swiper = new Swiper('.pd-gallery-slider', {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
}

// Función para cargar más proyectos (excluyendo el actual)
async function loadMoreProjects(currentSlug) {
  try {
    const response = await fetch('proyectos.json');
    const projects = await response.json();
    
    // Filtrar proyectos (excluir el actual y tomar solo 3)
    const otherProjects = projects
      .filter(p => p.slug !== currentSlug)
      .slice(0, 3);
    
    const moreGrid = document.querySelector('.pd-more-grid');
    if (moreGrid) {
      moreGrid.innerHTML = otherProjects.map(project => {
        const authorsHTML = project.authors.map(a =>
          `<img src="${a.avatar}" alt="${a.name}" class="pd-more-avatar-img">`
        ).join('');
        
        return `
          <a href="detalles.html?slug=${project.slug}" class="pd-more-card">
            <figure class="pd-more-figure">
              <img src="${project.thumbnail}" alt="${project.title}" class="pd-more-img">
              <div class="pd-more-avatars">${authorsHTML}</div>
            </figure>
            <div class="pd-more-card-title">${project.title}</div>
          </a>
        `;
      }).join('');
    }
  } catch (error) {
    console.error('Error al cargar más proyectos:', error);
  }
}

// Función para mostrar mensaje de error
function showError(message) {
  const errorDiv = document.getElementById('error-message');
  const mainContent = document.querySelector('.pd-hero');
  
  if (errorDiv) {
    errorDiv.style.display = 'block';
    if (mainContent) {
      mainContent.style.display = 'none';
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  loadProjectDetails();
  
  // Inicializar Swiper para móvil
  if (window.Swiper) {
    window.swiper = new Swiper('.pd-gallery-slider', {
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }
}); 
