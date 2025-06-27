// Formateador de fechas para BOCO
class DateFormatter {
  constructor() {
    this.months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    this.days = [
      'Domingo', 'Lunes', 'Martes', 'Miércoles', 
      'Jueves', 'Viernes', 'Sábado'
    ];
  }

  // Formatear fecha para blogs: "Jueves, 26 de Junio 2025"
  formatBlogDate(dateString) {
    const date = new Date(dateString);
    const dayName = this.days[date.getDay()];
    const day = date.getDate();
    const month = this.months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName}, ${day} de ${month} ${year}`;
  }

  // Formatear fecha corta: "26 Jun 2025"
  formatShortDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = this.months[date.getMonth()].substring(0, 3);
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  }

  // Formatear fecha para meta tags: "2025-06-26"
  formatMetaDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  // Obtener tiempo relativo: "hace 2 días"
  getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'hoy';
    if (diffDays === 1) return 'ayer';
    if (diffDays < 7) return `hace ${diffDays} días`;
    if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `hace ${Math.floor(diffDays / 30)} meses`;
    return `hace ${Math.floor(diffDays / 365)} años`;
  }
}

// Instancia global
window.dateFormatter = new DateFormatter();

// Función para formatear todas las fechas en la página
function formatAllDates() {
  const dateElements = document.querySelectorAll('[data-date]');
  
  dateElements.forEach(element => {
    const dateString = element.getAttribute('data-date');
    const format = element.getAttribute('data-format') || 'blog';
    
    let formattedDate = '';
    switch(format) {
      case 'blog':
        formattedDate = window.dateFormatter.formatBlogDate(dateString);
        break;
      case 'short':
        formattedDate = window.dateFormatter.formatShortDate(dateString);
        break;
      case 'relative':
        formattedDate = window.dateFormatter.getRelativeTime(dateString);
        break;
      default:
        formattedDate = window.dateFormatter.formatBlogDate(dateString);
    }
    
    element.textContent = formattedDate;
  });
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', formatAllDates); 