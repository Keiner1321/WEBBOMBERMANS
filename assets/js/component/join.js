function toggleOtherGender() {
    const genderSelect = document.getElementById('gender');
    const otherGenderRow = document.getElementById('other-gender-row');
    const otherGenderInput = document.getElementById('other_gender');

    if (genderSelect.value === 'otro') {
        otherGenderRow.style.display = 'flex';
        otherGenderInput.required = true;
    } else {
        otherGenderRow.style.display = 'none';
        otherGenderInput.required = false;
        otherGenderInput.value = '';
    }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".join-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validaciones antes de enviar
    const gender = document.getElementById('gender').value;
    const otherGenderInput = document.getElementById('other_gender');
    if (gender === 'otro' && otherGenderInput.value.trim() === '') {
      showToast('Por favor, especifique su género cuando seleccione "Otro".', 'error');
      return;
    }

    // Preparar FormData y enviar vía fetch para evitar recargar la página
    const formData = new FormData(form);

    try {
      const resp = await fetch(form.action, {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        body: formData
      });

      // Intentar parsear JSON (db.php responde JSON si es petición AJAX)
      const contentType = resp.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await resp.json();
        if (data.success) {
          showToast(data.message || 'Tu solicitud fue enviada con éxito', 'success');
          form.reset();
          toggleOtherGender();
        } else {
          showToast(data.message || 'Ocurrió un error al enviar la solicitud', 'error');
        }
      } else {
        // Fallback: tratar la respuesta como texto y buscar palabras clave
        const text = await resp.text();
        if (text.includes('Aspirante creado correctamente')) {
          showToast('Tu solicitud fue enviada con éxito', 'success');
          form.reset();
          toggleOtherGender();
        } else {
          showToast('Ocurrió un error al enviar la solicitud', 'error');
          console.error('Respuesta inesperada:', text);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Error de conexión. Intenta de nuevo más tarde.', 'error');
    }
  });

  // Función para crear notificaciones
  function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid ${type === "success" ? "fa-circle-check" : "fa-circle-xmark"}"></i> ${message}`;

    container.appendChild(toast);

    // Eliminar después de 5s
    setTimeout(() => {
      toast.remove();
    }, 5000);

    // Cerrar manualmente al hacer clic
    toast.addEventListener("click", () => toast.remove());
  }
});
