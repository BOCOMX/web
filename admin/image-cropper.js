// Configuración personalizada para recorte de imágenes en Netlify CMS
window.CMS.registerWidget('image', {
  // Configuraciones específicas por tipo de imagen
  getConfig: function(field) {
    const configs = {
      // Blog - Imagen Principal
      'main_image': {
        aspectRatio: 8/5, // 800x500
        minWidth: 800,
        minHeight: 500,
        quality: 85,
        format: 'webp'
      },
      // Blog - Imagen 2
      'image_2': {
        aspectRatio: 2/1, // 1200x600
        minWidth: 1200,
        minHeight: 600,
        quality: 85,
        format: 'webp'
      },
      // Blog - Miniatura
      'thumbnail': {
        aspectRatio: 4/3, // 400x300
        minWidth: 400,
        minHeight: 300,
        quality: 80,
        format: 'webp'
      },
      // Blog - Avatar del autor
      'author_avatar': {
        aspectRatio: 1/1, // 100x100
        minWidth: 100,
        minHeight: 100,
        quality: 90,
        format: 'webp'
      },
      // Proyectos - Imagen Principal
      'project_main_image': {
        aspectRatio: 1920/500,
        minWidth: 1920,
        minHeight: 500,
        quality: 85,
        format: 'webp'
      },
      // Proyectos - Miniatura
      'project_thumbnail': {
        aspectRatio: 510/600,
        minWidth: 510,
        minHeight: 600,
        quality: 80,
        format: 'webp'
      },
      // Proyectos - Galería
      'gallery_image': {
        aspectRatio: 640/300,
        minWidth: 640,
        minHeight: 300,
        quality: 85,
        format: 'webp'
      }
    };

    return configs[field.name] || {
      aspectRatio: 16/9,
      quality: 80,
      format: 'webp'
    };
  },

  // Aplicar configuración al widget
  applyConfig: function(field) {
    const config = this.getConfig(field);
    
    // Agregar hints visuales
    const hint = document.createElement('div');
    hint.className = 'image-hint';
    hint.innerHTML = `
      <div style="background: #f0f8ff; border: 1px solid #b3d9ff; border-radius: 6px; padding: 8px; margin: 8px 0; font-size: 12px; color: #0066cc;">
        📐 Dimensiones recomendadas: ${config.minWidth}x${config.minHeight}px
        ${config.aspectRatio ? ` | 📏 Proporción: ${config.aspectRatio}` : ''}
        ${config.quality ? ` | 🎯 Calidad: ${config.quality}%` : ''}
      </div>
    `;
    
    // Insertar hint después del campo
    const fieldElement = document.querySelector(`[name="${field.name}"]`);
    if (fieldElement) {
      fieldElement.parentNode.insertBefore(hint, fieldElement.nextSibling);
    }
  }
});

// Mejorar la experiencia de carga de imágenes
document.addEventListener('DOMContentLoaded', function() {
  // Agregar tooltips informativos
  const imageFields = document.querySelectorAll('.nc-widget-image');
  
  imageFields.forEach(field => {
    const fieldName = field.querySelector('input')?.name;
    if (fieldName) {
      const config = window.CMS.widgets.image.getConfig({ name: fieldName });
      
      // Agregar indicador visual
      const indicator = document.createElement('div');
      indicator.className = 'image-indicator';
      indicator.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        pointer-events: none;
      `;
      indicator.textContent = `${config.minWidth}x${config.minHeight}`;
      
      field.style.position = 'relative';
      field.appendChild(indicator);
    }
  });
});

// Configuración para transformaciones automáticas
window.CMS.registerPreviewStyle('/admin/preview-styles.css');

// Agregar validación de imágenes
window.CMS.registerWidget('image', {
  validate: function(value, field) {
    if (!value) return null;
    
    const config = this.getConfig(field);
    const img = new Image();
    
    return new Promise((resolve) => {
      img.onload = function() {
        const isValid = img.width >= config.minWidth && img.height >= config.minHeight;
        
        if (!isValid) {
          resolve(`La imagen debe ser al menos ${config.minWidth}x${config.minHeight}px. Actual: ${img.width}x${img.height}px`);
        } else {
          resolve(null);
        }
      };
      
      img.onerror = function() {
        resolve('No se pudo cargar la imagen');
      };
      
      img.src = value;
    });
  }
}); 