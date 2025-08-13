// ========================================
// GESTIÓN COMPLETA DE NAVEGACIÓN (ACTIVA + HAMBURGUESA)
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar ambos sistemas
    initActiveNavigation();
    setupMobileMenu();
});

/**
 * Configura el menú hamburguesa para móviles
 */
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!menuToggle || !navMenu) {
        console.warn('⚠️ Elementos del menú móvil no encontrados');
        return;
    }
    
    // Función para alternar el menú
    function toggleMenu() {
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Cambiar icono (hamburguesa ↔ X)
        if (navMenu.classList.contains('active')) {
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            console.log('🔄 Menú móvil abierto');
        } else {
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            console.log('🔄 Menú móvil cerrado');
        }
    }
    
    // Evento click para el botón
    menuToggle.addEventListener('click', toggleMenu);
    
    // Cerrar menú al seleccionar opción (solo móviles)
    document.querySelectorAll('#navMenu a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                toggleMenu();
                // Forzar actualización del enlace activo
                setTimeout(setActiveNavLink, 100);
            }
        });
    });
    
    // Cerrar menú al redimensionar pantalla
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
}

/**
 * Función para establecer el enlace activo basado en la URL actual
 */
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    
    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('nav a.ov-btn-grow-ellipse');
    
    if (navLinks.length === 0) {
        console.warn('⚠️ No se encontraron enlaces de navegación');
        return;
    }
    
    // Remover la clase active de todos los enlaces
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Mapeo de páginas a enlaces
    const pageMapping = {
        'index.html': 'Inicio',
        '': 'Inicio',
        'about.html': 'Sobre Nosotros',
        'services.html': 'Servicios', 
        'join.html': 'Unirse',
        'contact.html': 'Contacto'
    };
    
    // Encontrar y activar el enlace correspondiente
    const targetText = pageMapping[currentPage] || pageMapping[''];
    let linkFound = false;
    
    navLinks.forEach(link => {
        if (link.textContent.trim() === targetText) {
            link.classList.add('active');
            linkFound = true;
        }
    });
    
    if (!linkFound) {
        console.warn(`⚠️ No se encontró enlace para: "${targetText}"`);
    }
}

/**
 * Función para manejar clicks en los enlaces de navegación
 */
function handleNavLinkClick(event) {
    const navLinks = document.querySelectorAll('nav a.ov-btn-grow-ellipse');
    navLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
}

/**
 * Función para inicializar la navegación activa
 */
function initActiveNavigation() {
    function tryInitialize() {
        const navLinks = document.querySelectorAll('nav a.ov-btn-grow-ellipse');
        
        if (navLinks.length === 0) return false;
        
        setActiveNavLink();
        
        navLinks.forEach(link => {
            link.removeEventListener('click', handleNavLinkClick);
            link.addEventListener('click', handleNavLinkClick);
        });
        
        return true;
    }
    
    if (!tryInitialize()) {
        [100, 250, 500, 1000].forEach(delay => {
            setTimeout(tryInitialize, delay);
        });
    }
}

// Hacer funciones disponibles globalmente
window.initActiveNavigation = initActiveNavigation;
window.setActiveNavLink = setActiveNavLink;