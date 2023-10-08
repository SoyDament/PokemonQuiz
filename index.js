const carousel = document.querySelector(".carousel");
const slides = document.querySelectorAll(".slide");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
let currentIndex = 0;

function showSlide(index) {
    const slideWidth = 600;
    carousel.style.transform = `translateX(-${index * slideWidth}px)`;
}

prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        showSlide(currentIndex);
    }
});

nextButton.addEventListener("click", () => {
    if (currentIndex < slides.length - 1) {
        currentIndex++;
        showSlide(currentIndex);
    }
});

// Auto-avance (opcional)
setInterval(() => {
    if (currentIndex < slides.length - 1) {
        currentIndex++;
        showSlide(currentIndex);
    } else {
        currentIndex = 0;
        showSlide(currentIndex);
    }
}, 3000);
