// assets/js/projects-dynamic.js

// Simulación de fetch de proyectos (en producción, usa fetch a un JSON generado por tu build o una API)
async function fetchProjects() {
  try {
    const response = await fetch('proyectos.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error cargando proyectos:', error);
    // Mostrar mensaje de error en la galería
    const gallery = document.getElementById('projectGallery');
    if (gallery) {
      gallery.innerHTML = '<p style="text-align: center; padding: 2rem;">Error cargando proyectos. Por favor, recarga la página.</p>';
    }
    return [];
  }
}

function renderProjects(projects, filter = 'proyectos') {
  const gallery = document.getElementById('projectGallery');
  if (!gallery) {
    console.error('No se encontró el elemento #projectGallery');
    return;
  }
  
  gallery.innerHTML = '';

  if (!projects || projects.length === 0) {
    gallery.innerHTML = '<p style="text-align: center; padding: 2rem;">No hay proyectos disponibles.</p>';
    return;
  }

  const filteredProjects = projects.filter(p => 
    (filter === 'proyectos' ? p.tipo === 'boco' : p.tipo === 'colaboracion')
  );

  if (filteredProjects.length === 0) {
    gallery.innerHTML = '<p style="text-align: center; padding: 2rem;">No hay proyectos en esta categoría.</p>';
    return;
  }

  filteredProjects.forEach(project => {
    const authorsHTML = project.authors ? project.authors.map(a =>
      `<img src="${a.avatar}" alt="${a.name}">`
    ).join('') : '';
    
    gallery.innerHTML += `
      <a href="project-details.html?slug=${project.slug}" class="project-card" data-category="${project.tipo}">
        <figure class="project-card-image">
          <img src="${project.thumbnail || project.main_image}" alt="${project.title}" />
          <div class="project-authors">${authorsHTML}</div>
        </figure>
        <div class="project-card-content">
          <h3>${project.title}</h3>
        </div>
      </a>
    `;
  });
}

// Filtros
if (document.querySelectorAll('.filter-btn').length) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      const projects = await fetchProjects();
      renderProjects(projects, filter);
    });
  });
}

// Inicialización
(async function() {
  console.log('Inicializando galería de proyectos...');
  const projects = await fetchProjects();
  console.log('Proyectos cargados:', projects.length);
  renderProjects(projects, 'proyectos');
})(); 
