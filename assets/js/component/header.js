// ========================================
// GESTIÓN DE NAVEGACIÓN ACTIVA
// ========================================

/**
 * Función para establecer el enlace activo basado en la URL actual
 */
function setActiveNavLink() {
    console.log('🔍 Iniciando setActiveNavLink...');
    
    // Obtener la URL actual
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    
    console.log(`📍 Ruta actual: ${currentPath}`);
    console.log(`📄 Página actual: ${currentPage}`);
    
    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('nav a.ov-btn-grow-ellipse');
    console.log(`🔗 Enlaces encontrados: ${navLinks.length}`);
    
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
        '': 'Inicio', // Para la ruta raíz
        'about.html': 'Sobre Nosotros',
        'services.html': 'Servicios', 
        'join.html': 'Unirse',
        'contact.html': 'Contacto'
    };
    
    // Encontrar y activar el enlace correspondiente
    const targetText = pageMapping[currentPage] || pageMapping[''];
    console.log(`🎯 Buscando enlace con texto: "${targetText}"`);
    
    let linkFound = false;
    navLinks.forEach(link => {
        const linkText = link.textContent.trim();
        console.log(`🔍 Comparando: "${linkText}" === "${targetText}"`);
        
        if (linkText === targetText) {
            link.classList.add('active');
            console.log(`✅ Enlace activo establecido: ${targetText}`);
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
    console.log('🚀 Inicializando navegación activa...');
    
    // Función para intentar inicializar
    function tryInitialize() {
        const navLinks = document.querySelectorAll('nav a.ov-btn-grow-ellipse');
        
        if (navLinks.length === 0) {
            console.log('⏳ Enlaces aún no disponibles, reintentando...');
            return false;
        }
        
        console.log(`✅ ${navLinks.length} enlaces encontrados, procediendo...`);
        
        // Establecer el enlace activo basado en la URL actual
        setActiveNavLink();
        
        // Agregar event listeners a todos los enlaces de navegación
        navLinks.forEach((link, index) => {
            // Remover listeners anteriores si existen
            link.removeEventListener('click', handleNavLinkClick);
            // Agregar nuevo listener
            link.addEventListener('click', handleNavLinkClick);
            console.log(`🔗 Listener agregado a: ${link.textContent.trim()}`);
        });
        
        console.log('✅ Sistema de navegación activa inicializado correctamente');
        return true;
    }
    
    // Intentar inicializar inmediatamente
    if (!tryInitialize()) {
        // Si falla, intentar con delays progresivos
        const delays = [100, 250, 500, 1000];
        
        delays.forEach(delay => {
            setTimeout(() => {
                if (!tryInitialize()) {
                    console.log(`❌ Intento fallido después de ${delay}ms`);
                }
            }, delay);
        });
    }
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

// ========================================
// FUNCIÓN DE DIAGNÓSTICO COMPLETO
// ========================================

/**
 * Función para diagnosticar problemas del sistema de navegación
 */
function fullDiagnostic() {
    console.log('🔧 === DIAGNÓSTICO COMPLETO DEL SISTEMA ===');
    
    // 1. Verificar estructura HTML
    console.log('1️⃣ Verificando estructura HTML...');
    const headerContainer = document.getElementById('header-container');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a.ov-btn-grow-ellipse');
    
    console.log(`   📦 Header container: ${headerContainer ? '✅ Existe' : '❌ No existe'}`);
    console.log(`   🧭 Nav element: ${nav ? '✅ Existe' : '❌ No existe'}`);
    console.log(`   🔗 Enlaces encontrados: ${navLinks.length}`);
    
    // 2. Verificar CSS
    console.log('2️⃣ Verificando CSS...');
    if (navLinks.length > 0) {
        const firstLink = navLinks[0];
        const computedStyle = window.getComputedStyle(firstLink);
        console.log(`   🎨 Color inicial: ${computedStyle.color}`);
        console.log(`   🎨 Background inicial: ${computedStyle.backgroundColor}`);
        
        // Verificar si tiene clase active
        const activeLink = document.querySelector('nav a.ov-btn-grow-ellipse.active');
        if (activeLink) {
            const activeStyle = window.getComputedStyle(activeLink);
            console.log(`   ✅ Enlace activo encontrado: ${activeLink.textContent.trim()}`);
            console.log(`   🎨 Background activo: ${activeStyle.backgroundColor}`);
        } else {
            console.log(`   ⚠️ No hay enlaces activos`);
        }
    }
    
    // 3. Verificar JavaScript
    console.log('3️⃣ Verificando JavaScript...');
    console.log(`   📍 URL actual: ${window.location.pathname}`);
    console.log(`   🔧 initActiveNavigation: ${typeof window.initActiveNavigation}`);
    console.log(`   🔧 setActiveNavLink: ${typeof window.setActiveNavLink}`);
    console.log(`   🔧 debugActiveLinks: ${typeof window.debugActiveLinks}`);
    
    // 4. Lista de enlaces
    console.log('4️⃣ Lista de enlaces...');
    navLinks.forEach((link, index) => {
        const isActive = link.classList.contains('active');
        const href = link.getAttribute('href');
        const text = link.textContent.trim();
        console.log(`   ${index + 1}. "${text}" (${href}) - Activo: ${isActive ? '✅' : '❌'}`);
    });
    
    console.log('🔧 === FIN DEL DIAGNÓSTICO ===');
}

// Hacer disponible globalmente
window.fullDiagnostic = fullDiagnostic;