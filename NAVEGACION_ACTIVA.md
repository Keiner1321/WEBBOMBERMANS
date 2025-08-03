# Sistema de Navegación Activa

## Descripción
Este sistema permite que los enlaces de navegación mantengan un estado "activo" (destacado) cuando corresponden a la página actual, utilizando la clase `.ov-btn-grow-ellipse` existente.

## Características Implementadas

### 1. Estilos CSS Activos
- Se agregaron estilos para `.ov-btn-grow-ellipse.active` en `assets/css/components/buttons.css`
- El estado activo mantiene el color rojo de fondo (#bd0b0b) de forma permanente
- Efecto visual consistente con el hover existente

### 2. JavaScript para Gestión de Estado
- Archivo: `assets/js/component/header.js`
- Detecta automáticamente la página actual
- Establece el enlace correspondiente como activo
- Maneja clicks en los enlaces para actualizar el estado

### 3. Integración Automática
- Se carga automáticamente con el header
- Funciona en todas las páginas del sitio
- No requiere configuración adicional

## Cómo Funciona

### Detección Automática
El sistema detecta automáticamente qué página está activa basándose en la URL:
- `index.html` o raíz → "Inicio"
- `about.html` → "Sobre Nosotros"  
- `services.html` → "Servicios"
- `join.html` → "Unirse"
- `contact.html` → "Contacto"

### Al Hacer Click
Cuando haces click en un enlace:
1. Se remueve la clase `active` de todos los enlaces
2. Se agrega la clase `active` al enlace clickeado
3. Se muestra un mensaje en la consola para debugging

## Cómo Revisar que Funciona Correctamente

### 1. Inspección Visual
- Navega entre las páginas
- El enlace de la página actual debe tener fondo rojo permanente
- Solo un enlace debe estar activo a la vez

### 2. Consola del Navegador
Abre la consola (F12) y ejecuta:

```javascript
// Ver estado actual de todos los enlaces
checkNavigationStatus();

// O directamente:
debugActiveLinks();
```

### 3. Inspeccionar en DevTools
- Abre las herramientas de desarrollador (F12)
- Ve a la pestaña "Elements"
- Inspecciona los enlaces `<a class="ov-btn-grow-ellipse">`
- El enlace activo debe tener la clase adicional `active`

### 4. Verificar en Diferentes Páginas
Prueba navegando a:
- http://tu-dominio/index.html (Inicio debe estar activo)
- http://tu-dominio/pages/services.html (Servicios debe estar activo)
- http://tu-dominio/pages/join.html (Unirse debe estar activo)

## Mensajes de Debugging
El sistema muestra mensajes en la consola:
- `"Sistema de navegación activa inicializado"`
- `"Enlace activo establecido: [nombre del enlace]"`
- `"Enlace clickeado: [nombre del enlace]"`

## Solución de Problemas

### El enlace no se marca como activo
1. Verifica que la página tenga el contenedor `<div id="header-container"></div>`
2. Asegúrate de que `main.js` se esté cargando correctamente
3. Revisa la consola por errores de JavaScript

### Múltiples enlaces activos
- Esto no debería pasar, pero si ocurre, ejecuta `setActiveNavLink()` en la consola

### Estilos no se aplican
- Verifica que `buttons.css` se esté cargando
- Inspecciona el elemento para ver si tiene la clase `active`
- Revisa que no haya conflictos de CSS

## Personalización

### Cambiar Colores del Estado Activo
Edita en `assets/css/components/buttons.css`:

```css
.ov-btn-grow-ellipse.active {
  background-color: #tu-color-aqui;
}

.ov-btn-grow-ellipse.active::after {
  background: #tu-color-hover-aqui;
}
```

### Agregar Nuevas Páginas
Si agregas nuevas páginas, actualiza el mapeo en `header.js`:

```javascript
const pageMapping = {
  'nueva-pagina.html': 'Texto del Enlace',
  // ... otros mapeos
};
```
