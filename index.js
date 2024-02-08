document.addEventListener("DOMContentLoaded", function () {
    const cardDeck = document.querySelector('.card-deck');
    let scrollPosition = window.scrollY;

    cardDeck.style.overflowY = 'auto'; // Habilitar la barra de desplazamiento solo para las tarjetas

    window.addEventListener('scroll', function () {
        const newScrollPosition = window.scrollY;

        // Calcular la distancia que se ha desplazado
        const scrollDistance = newScrollPosition - scrollPosition;

        // Aplicar una transformación a las tarjetas basada en la distancia de desplazamiento
        cardDeck.style.transform = `translateY(${scrollDistance}px)`;

        // Actualizar la posición de desplazamiento para el siguiente evento
        scrollPosition = newScrollPosition;
    });
});

