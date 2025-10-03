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

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    showToast("Tu solicitud fue enviada con éxito", "success");
    form.reset();
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
