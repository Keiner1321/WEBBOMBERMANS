// ========================================
// IMPORTACIÓN DE COMPONENTES
// ========================================

// Función para obtener la ruta base correcta
function getBasePath() {
    const currentPath = window.location.pathname;
    // Si estamos en una subcarpeta (pages/), usar ../ 
    if (currentPath.includes('/pages/')) {
        return '../';
    }
    // Si estamos en la raíz, usar ./
    return './';
}

// Función para cargar el header
function loadHeader() {
    const basePath = getBasePath();
    fetch(`${basePath}components/header.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            
            // Cargar el script de header y inicializar navegación activa
            const script = document.createElement('script');
            script.src = `${basePath}assets/js/component/header.js`;
            script.onload = function() {
                // Inicializar navegación activa después de cargar el script
                if (window.initActiveNavigation) {
                    window.initActiveNavigation();
                }
            };
            document.head.appendChild(script);
        })
        .catch(error => {
            console.error('Error cargando header:', error);
        });
}

// Función para cargar el footer
function loadFooter() {
    const basePath = getBasePath();
    fetch(`${basePath}components/footer.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
            // Ejecutar el script del footer después de cargarlo
            const year = new Date().getFullYear();
            const copyrightElement = document.getElementById("copyright");
            if (copyrightElement) {
                copyrightElement.innerHTML = `&copy; ${year} / Derechos reservados`;
            }
        })
        .catch(error => {
            console.error('Error cargando footer:', error);
        });
}

// Función para cargar todos los componentes
function loadAllComponents() {
    loadHeader();
    loadFooter();
}

// ========================================
// INICIALIZACIÓN
// ========================================

// Ejecutar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    loadAllComponents();
});

// ========================================
// OTRAS FUNCIONES (puedes agregar más aquí)
// ========================================

// Función para actualizar el año automáticamente
function updateYear() {
    const year = new Date().getFullYear();
    const copyrightElement = document.getElementById("copyright");
    if (copyrightElement) {
        copyrightElement.innerHTML = `&copy; ${year} / Derechos reservados`;
    }
}

function loadHeader() {
    const basePath = getBasePath();
    fetch(`${basePath}components/header.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;

            // 🔴 Aquí activamos el menú hamburguesa después de insertar el header
            const toggle = document.getElementById("menuToggle");
            const navMenu = document.getElementById("navMenu");

            if (toggle && navMenu) {
                toggle.addEventListener("click", function () {
                    navMenu.classList.toggle("active");
                });
            }
        })
        .catch(error => {
            console.error('Error cargando header:', error);
        });
}
