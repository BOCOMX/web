/*==================== HERO & LOGO CAROUSEL ====================*/

document.addEventListener('DOMContentLoaded', function () {

  // Hero Slider
  if (typeof Swiper !== 'undefined' && document.querySelector('.hero-slider')) {
    const heroSlider = new Swiper('.hero-slider', {
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
    });
  }

  // Projects Slider responsivo
  let projectsSlider;
  function initProjectsSlider() {
    if (typeof Swiper === 'undefined' || !document.querySelector('.projects-slider')) return;
    // Asegura que el div de paginación exista
    const slider = document.querySelector('.projects-slider');
    if (slider && !slider.querySelector('.swiper-pagination')) {
      const pagDiv = document.createElement('div');
      pagDiv.className = 'swiper-pagination';
      slider.appendChild(pagDiv);
    }
    if (window.innerWidth <= 768) {
      if (projectsSlider) projectsSlider.destroy(true, true);
      projectsSlider = new Swiper('.projects-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
          el: '.projects-slider .swiper-pagination',
          clickable: true,
        },
        navigation: false,
        allowTouchMove: true,
      });
    } else {
      if (projectsSlider) projectsSlider.destroy(true, true);
      projectsSlider = new Swiper('.projects-slider', {
        slidesPerView: 3,
        spaceBetween: 30,
        navigation: {
          nextEl: '.projects-section .swiper-button-next',
          prevEl: '.projects-section .swiper-button-prev',
        },
        pagination: {
          el: '.projects-slider .swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1200: {
            slidesPerView: 4,
          }
        }
      });
    }
  }
  initProjectsSlider();
  window.addEventListener('resize', () => {
    initProjectsSlider();
  });

  // Project Gallery Filtering
  const filterContainer = document.querySelector('.project-filters');
  const galleryItems = document.querySelectorAll('.project-gallery-grid .project-card');

  const filterItems = (filterValue) => {
    galleryItems.forEach(item => {
      if (item.getAttribute('data-category') === filterValue) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  };

  if (filterContainer && galleryItems.length > 0) {
    // Set initial filter to 'proyectos' on page load
    filterItems('proyectos');

    filterContainer.addEventListener('click', (event) => {
      if (event.target.classList.contains('filter-btn')) {
        // Deactivate existing active button
        filterContainer.querySelector('.active').classList.remove('active');
        // Activate new button
        event.target.classList.add('active');

        const filterValue = event.target.getAttribute('data-filter');
        filterItems(filterValue);
      }
    });
  }

  // Services Slider solo en móviles
  if (typeof Swiper !== 'undefined' && window.innerWidth <= 768 && document.querySelector('.services-slider')) {
    new Swiper('.services-slider', {
      slidesPerView: 1,
      spaceBetween: 24,
      navigation: {
        nextEl: '.services-slider .swiper-button-next',
        prevEl: '.services-slider .swiper-button-prev',
      },
      pagination: {
        el: '.services-slider .swiper-pagination',
        clickable: true,
      },
      loop: false,
      allowTouchMove: true,
    });
  }

  // === MENÚ MÓVIL ===
  const menuBtn = document.querySelector('header button[aria-label="Toggle menu"]');
  let mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

  if (menuBtn) {
    if (!mobileMenuOverlay) {
      // Crear overlay si no existe
      mobileMenuOverlay = document.createElement('div');
      mobileMenuOverlay.className = 'mobile-menu-overlay closed';
      mobileMenuOverlay.innerHTML = `
        <nav class="mobile-menu-list">
          <a href="index.html#inicio" class="mobile-menu-link">Inicio</a>
          <a href="acercade.html" class="mobile-menu-link">Nosotros</a>
          <a href="proyectos.html" class="mobile-menu-link">Proyectos</a>
          <a href="blog.html" class="mobile-menu-link">Blog</a>
          <a href="contacto.html" class="mobile-menu-link">Contacto</a>
        </nav>
        <button class="mobile-menu-close" aria-label="Cerrar menú"><i class="ri-close-line"></i></button>
      `;
      document.body.appendChild(mobileMenuOverlay);
    }
    // Lógica para submenú móvil
    const dropdownToggle = mobileMenuOverlay.querySelector('.mobile-menu-dropdown-toggle');
    const dropdownMenu = mobileMenuOverlay.querySelector('.mobile-menu-dropdown-menu');
    if (dropdownToggle && dropdownMenu) {
      dropdownToggle.addEventListener('click', function() {
        const expanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
        dropdownToggle.setAttribute('aria-expanded', !expanded);
        dropdownMenu.hidden = expanded;
      });
    }
    // Abrir menú
    menuBtn.addEventListener('click', function() {
      mobileMenuOverlay.classList.remove('closed');
      document.body.style.overflow = 'hidden';
      // Cerrar submenú siempre al abrir el menú móvil
      const dropdownToggle = mobileMenuOverlay.querySelector('.mobile-menu-dropdown-toggle');
      const dropdownMenu = mobileMenuOverlay.querySelector('.mobile-menu-dropdown-menu');
      if (dropdownToggle && dropdownMenu) {
        dropdownToggle.setAttribute('aria-expanded', 'false');
        dropdownMenu.hidden = true;
      }
    });
    // Cerrar menú
    mobileMenuOverlay.querySelector('.mobile-menu-close').addEventListener('click', function() {
      mobileMenuOverlay.classList.add('closed');
      document.body.style.overflow = '';
    });
    // Cerrar al hacer click fuera del menú
    mobileMenuOverlay.addEventListener('click', function(e) {
      if (e.target === mobileMenuOverlay) {
        mobileMenuOverlay.classList.add('closed');
        document.body.style.overflow = '';
      }
    });
  }

  // Ocultar overlay si cambia a escritorio
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && mobileMenuOverlay && !mobileMenuOverlay.classList.contains('closed')) {
      mobileMenuOverlay.classList.add('closed');
      document.body.style.overflow = '';
    }
  });

  // Galería de fotos en detalles de proyecto (solo móvil)
  if (typeof Swiper !== 'undefined' && document.querySelector('.pd-gallery-slider')) {
    new Swiper('.pd-gallery-slider', {
      slidesPerView: 1,
      spaceBetween: 24,
      pagination: {
        el: '.pd-gallery-slider .swiper-pagination',
        clickable: true,
      },
      navigation: false,
      loop: false,
      allowTouchMove: true,
    });
  }

});
