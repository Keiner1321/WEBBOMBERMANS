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
            
            // 🔹 Activar menú hamburguesa si existe
            const toggle = document.getElementById("menuToggle");
            const navMenu = document.getElementById("navMenu");

            if (toggle && navMenu) {
                toggle.addEventListener("click", function () {
                    navMenu.classList.toggle("active");
                });
            }
            
            // 🔹 Cargar el script de header y inicializar navegación activa
            const script = document.createElement('script');
            script.src = `${basePath}assets/js/component/header.js`;
            script.onload = function() {
                // Inicializar navegación activa después de cargar el script
                if (window.initActiveNavigation) {
                    window.initActiveNavigation();
                } else {
                    console.warn('initActiveNavigation no está disponible');
                }
            };
            script.onerror = function() {
                console.error('Error cargando header.js');
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
    initScrollNavigation();
});

// ========================================
// NAVEGACIÓN SUAVE
// ========================================

/**
 * Función para inicializar la navegación suave hacia secciones
 */
function initScrollNavigation() {
    // Buscar el botón "Leer más" con clase botonmas
    const readMoreButton = document.querySelector('.botonmas');
    
    if (readMoreButton) {
        readMoreButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevenir cualquier comportamiento por defecto
            
            // Buscar la sección misión-visión
            const misionVisionSection = document.getElementById('mision-vision');
            
            if (misionVisionSection) {
                // Scroll suave hacia la sección
                misionVisionSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                console.warn('No se encontró la sección mision-vision');
            }
        });
    } else {
        console.warn('No se encontró el botón con clase botonmas');
    }
}

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

// ========================================
// FUNCIONES DE DEBUGGING
// ========================================

/**
 * Función para revisar el estado de los enlaces de navegación
 * Útil para debugging - ejecutar en la consola del navegador
 */
function checkNavigationStatus() {
    if (window.debugActiveLinks) {
        window.debugActiveLinks();
    } else {
        console.log('Sistema de navegación aún no inicializado');
    }
}

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".btn.prev");
  const nextBtn = document.querySelector(".btn.next");
  const indicatorsContainer = document.querySelector(".indicators");
  let index = 0;

  // Crear indicadores
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    indicatorsContainer.appendChild(dot);
    dot.addEventListener("click", () => {
      index = i;
      updateSlider();
    });
  });

  const indicators = indicatorsContainer.querySelectorAll("span");

  function updateSlider() {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[index].classList.add("active");
    document.querySelector(".slides").style.transform = `translateX(-${index * 100}%)`;
    indicators.forEach(dot => dot.classList.remove("active"));
    indicators[index].classList.add("active");
  }

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    updateSlider();
  });

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    updateSlider();
  });

  // Autoplay cada 5s
  setInterval(() => {
    index = (index + 1) % slides.length;
    updateSlider();
  }, 5000);
});
