// ========================================
// GESTIÓN DE NAVEGACIÓN ACTIVA
// ========================================

/**
 * Función para establecer el enlace activo basado en la URL actual
 */
function setActiveNavLink() {
    // Obtener la URL actual
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    
    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('nav a.ov-btn-grow-ellipse');
    
    // Remover la clase active de todos los enlaces
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Mapeo de páginas a enlaces
    const pageMapping = {
        'index.html': 'Inicio',
        '': 'Inicio', // Para la ruta raíz
        'about.html': 'Sobre Nosotros',
        'services.html': 'Servicios', 
        'join.html': 'Unirse',
        'contact.html': 'Contacto'
    };
    
    // Encontrar y activar el enlace correspondiente
    const targetText = pageMapping[currentPage] || pageMapping[''];
    
    navLinks.forEach(link => {
        if (link.textContent.trim() === targetText) {
            link.classList.add('active');
            console.log(`Enlace activo establecido: ${targetText}`);
        }
    });
}

/**
 * Función para manejar clicks en los enlaces de navegación
 */
function handleNavLinkClick(event) {
    // Remover clase active de todos los enlaces
    const navLinks = document.querySelectorAll('nav a.ov-btn-grow-ellipse');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Agregar clase active al enlace clickeado
    event.target.classList.add('active');
    
    console.log(`Enlace clickeado: ${event.target.textContent.trim()}`);
}

/**
 * Función para inicializar la navegación activa
 */
function initActiveNavigation() {
    // Esperar a que el header se cargue completamente
    setTimeout(() => {
        // Establecer el enlace activo basado en la URL actual
        setActiveNavLink();
        
        // Agregar event listeners a todos los enlaces de navegación
        const navLinks = document.querySelectorAll('nav a.ov-btn-grow-ellipse');
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
        });
        
        console.log('Sistema de navegación activa inicializado');
    }, 100); // Pequeño delay para asegurar que el DOM esté listo
}

/**
 * Función para revisar el estado actual de los enlaces
 */
function debugActiveLinks() {
    const navLinks = document.querySelectorAll('nav a.ov-btn-grow-ellipse');
    console.log('=== ESTADO ACTUAL DE ENLACES ===');
    console.log(`URL actual: ${window.location.pathname}`);
    
    navLinks.forEach((link, index) => {
        const isActive = link.classList.contains('active');
        const href = link.getAttribute('href');
        const text = link.textContent.trim();
        
        console.log(`${index + 1}. ${text} (${href}) - Activo: ${isActive}`);
    });
    console.log('================================');
}

// ========================================
// EXPORTAR FUNCIONES PARA USO GLOBAL
// ========================================

// Hacer las funciones disponibles globalmente
window.initActiveNavigation = initActiveNavigation;
window.debugActiveLinks = debugActiveLinks;
window.setActiveNavLink = setActiveNavLink;