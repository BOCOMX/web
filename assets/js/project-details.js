// assets/js/project-details.js

// Función para obtener el slug del proyecto desde la URL
function getProjectSlug() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('slug');
}

// Función para cargar los proyectos desde el JSON
async function fetchProjects() {
  try {
    const response = await fetch('proyectos.json');
    return await response.json();
  } catch (error) {
    console.error('Error cargando proyectos:', error);
    return [];
  }
}

// Función para encontrar el proyecto por slug
function findProjectBySlug(projects, slug) {
  return projects.find(project => project.slug === slug);
}

// Función para renderizar los participantes
function renderParticipants(participants) {
  if (!participants || participants.length === 0) {
    return '<p>No hay participantes registrados</p>';
  }

  return participants.map(participant => `
    <div class="pd-avatar-item">
      <img src="${participant.avatar}" alt="${participant.name}" class="pd-avatar-img">
      <span class="pd-avatar-name">${participant.name}</span>
    </div>
  `).join('');
}

// Función para renderizar la galería de fotos
function renderGallery(gallery) {
  if (!gallery || gallery.length === 0) {
    return '<p>No hay fotos en la galería</p>';
  }

  // Galería para desktop
  const desktopGallery = gallery.map(photo => `
    <img src="${photo.image}" alt="Foto del proyecto" class="pd-gallery-img">
  `).join('');

  // Galería para móvil (slider)
  const mobileGallery = gallery.map(photo => `
    <div class="swiper-slide">
      <img src="${photo.image}" alt="Foto del proyecto" class="pd-gallery-img">
    </div>
  `).join('');

  return { desktopGallery, mobileGallery };
}

// Función principal para cargar y mostrar el proyecto
async function loadProjectDetails() {
  const slug = getProjectSlug();
  
  if (!slug) {
    showError('No se especificó un proyecto');
    return;
  }

  try {
    // Mostrar estado de carga
    document.getElementById('projectTitle').textContent = 'Cargando...';
    
    // Cargar proyectos
    const projects = await fetchProjects();
    const project = findProjectBySlug(projects, slug);

    if (!project) {
      showError('Proyecto no encontrado');
      return;
    }

    // Llenar la información del proyecto
    document.getElementById('projectTitle').textContent = project.title;
    document.getElementById('projectMainImage').src = project.main_image;
    document.getElementById('projectMainImage').alt = project.title;
    document.getElementById('projectDescription').innerHTML = project.description || 'Sin descripción disponible';
    document.getElementById('projectParticipants').innerHTML = renderParticipants(project.authors);

    // Renderizar galería si existe
    if (project.gallery && project.gallery.length > 0) {
      const galleryHTML = renderGallery(project.gallery);
      document.getElementById('desktopGallery').innerHTML = galleryHTML.desktopGallery;
      document.getElementById('mobileGallery').querySelector('.swiper-wrapper').innerHTML = galleryHTML.mobileGallery;
      
      // Reinicializar Swiper si existe
      if (window.Swiper) {
        new Swiper('.pd-gallery-slider', {
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
        });
      }
    } else {
      // Ocultar sección de galería si no hay fotos
      document.getElementById('projectGallery').style.display = 'none';
    }

  } catch (error) {
    console.error('Error cargando detalles del proyecto:', error);
    showError('Error cargando el proyecto');
  }
}

// Función para mostrar errores
function showError(message) {
  document.getElementById('projectTitle').textContent = 'Error';
  document.getElementById('projectDescription').textContent = message;
}

// Cargar detalles del proyecto cuando la página esté lista
document.addEventListener('DOMContentLoaded', loadProjectDetails); 