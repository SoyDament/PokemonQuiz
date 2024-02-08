// Obtén referencias a los elementos relevantes
const infoButton = document.getElementById("info-button");
const infoModal = document.getElementById("info-modal");
const closeButton = document.querySelector(".close-button");

// Muestra el modal al hacer clic en el botón de información
infoButton.addEventListener("click", () => {
    infoModal.style.display = "block";
});

// Oculta el modal al hacer clic en el botón de cierre
closeButton.addEventListener("click", () => {
    infoModal.style.display = "none";
});

// También puedes ocultar el modal si se hace clic fuera de él
window.addEventListener("click", (event) => {
    if (event.target === infoModal) {
        infoModal.style.display = "none";
    }
});
