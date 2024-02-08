document.addEventListener("DOMContentLoaded", function () {
    const pokeImage = document.getElementById("pokemon-image");
    let attempts = 0;

    function startGame(generation) {
        attempts = 0;
        const optionsList = document.getElementById("options-list");
        optionsList.classList.remove("disabled");

        // Restaurar la visibilidad y la animación de la imagen
        pokeImage.style.display = 'block';
        pokeImage.style.animation = "reveal 2s ease-in-out";

        setTimeout(() => {
            getRandomPokemon(generation, (data) => {
                pokeImage.src = data.pngUrl;
                generateOptions(data.pokemonName, (options) => {
                    displayOptions(options, data.pokemonName);
                    // Quitar la animación después de mostrar las opciones
                    pokeImage.style.animation = "none";
                });
            });
        }, 2000);
    }

    // Resto del código...
});
