// assets/js/projects-dynamic.js

// Simulación de fetch de proyectos (en producción, usa fetch a un JSON generado por tu build o una API)
async function fetchProjects() {
  const response = await fetch('proyectos.json');
  return await response.json();
}

function renderProjects(projects, filter = 'proyectos') {
  const gallery = document.getElementById('projectGallery');
  gallery.innerHTML = '';

  projects
    .filter(p => (filter === 'proyectos' ? p.tipo === 'boco' : p.tipo === 'colaboracion'))
    .forEach(project => {
      const authorsHTML = project.authors.map(a =>
        `<img src="${a.avatar}" alt="${a.name}">`
      ).join('');
      gallery.innerHTML += `
        <a href="detalles.html?slug=${project.slug}" class="project-card" data-category="${project.tipo}">
          <figure class="project-card-image">
            <img src="${project.thumbnail}" alt="${project.title}" />
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
  const projects = await fetchProjects();
  renderProjects(projects, 'proyectos');
})(); 
