document.addEventListener("DOMContentLoaded", function () {
    const gameConfig = {
        // Puedes agregar configuración aquí si es necesario.
    };
    let pokemonName; // Definir pokemonName en el ámbito global
    let isAnimating = false; // Variable para rastrear si se está realizando una animación

    async function getRandomPokemonId() {
        return Math.floor(Math.random() * 151) + 1;
    }

    async function getPokemonData(pokemonId) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const data = await response.json();
        return capitalizeFirstLetter(data.name);
    }

    async function getRandomPokemon() {
        const pokemonId = await getRandomPokemonId();
        const gifUrl = `assets/animated/${String(pokemonId).padStart(3, '0')}.gif`; // Utiliza el ID con ceros iniciales
        pokemonName = await getPokemonData(pokemonId); // Obtén el nombre del Pokémon
        return gifUrl;
    }

    async function getAllFirstGenPokemonNames() {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const data = await response.json();
        return data.results.map((pokemon) => capitalizeFirstLetter(pokemon.name));
    }

    async function generateOptions(correctName) {
        const allFirstGenPokemonNames = await getAllFirstGenPokemonNames();
        const options = [];

        while (options.length < 3) {
            const randomIndex = Math.floor(Math.random() * allFirstGenPokemonNames.length);
            const randomName = allFirstGenPokemonNames[randomIndex];
            if (!options.includes(randomName) && randomName !== correctName) {
                options.push(randomName);
            }
        }

        options.push(correctName); // Agrega el nombre correcto a las opciones

        return shuffleArray(options);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function displayOptions(options, correctName) {
        const optionsList = document.getElementById("options-list");
        optionsList.innerHTML = "";

        options.forEach((option, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
            optionsList.appendChild(listItem);

            listItem.addEventListener("click", () => {
                if (!isAnimating) {
                    isAnimating = true; // Marcar como animación en curso para evitar clics repetidos
                    if (option === correctName) {
                        showResponseMessage("¡Correcto!", true);
                        revealPokemon();
                    } else {
                        showResponseMessage("¡Incorrecto! Intenta de nuevo.", false);
                        isAnimating = false; // Restablecer la animación a false si la respuesta es incorrecta
                    }
                }
            });

        });
    }

    function capitalizeFirstLetter(string) {
        if (typeof string === 'string') {
            return string.charAt(0).toUpperCase() + string.slice(1);
        } else {
            return ''; // O devuelve una cadena vacía o maneja el caso de error de otra manera
        }
    }
    function showResponseMessage(message, isCorrect) {
        const responseMessageInline = document.getElementById("response-message-inline");
        const pokemonImage = document.getElementById("pokemon-image");

        responseMessageInline.textContent = message;

        if (isCorrect) {
            responseMessageInline.style.backgroundColor = "#4CAF50"; // Color verde para respuesta correcta
            revealPokemon(pokemonImage);
        } else {
            responseMessageInline.style.backgroundColor = "#FF5722"; // Color rojo para respuesta incorrecta

            // Agregar la clase de sacudida a la imagen del Pokémon en caso de respuesta incorrecta
            pokemonImage.classList.add("shake");

            // Quitar la clase de sacudida después de un tiempo
            setTimeout(() => {
                pokemonImage.classList.remove("shake");
            }, 500); // Duración de la animación en milisegundos (0.5 segundos en este caso)
        }

        // Mostrar el mensaje en línea
        responseMessageInline.classList.add("show-message");

        // Ocultar el mensaje en línea después de 1.5 segundos (tanto para respuestas correctas como incorrectas)
        setTimeout(() => {
            responseMessageInline.classList.remove("show-message");
        }, 1500); // Duración de la animación (en milisegundos)
    }




    function revealPokemon() {
        const pokemonImage = document.getElementById("pokemon-image");
        pokemonImage.style.filter = "brightness(100%)"; // Hacer que la imagen del Pokémon sea completamente visible

        // Retrasar la restauración del brillo después de un tiempo (por ejemplo, 2 segundos)
        setTimeout(() => {
            pokemonImage.style.filter = "brightness(0%)"; // Hacer que la imagen del Pokémon esté sin brillo
            isAnimating = false; // Marcar como animación completada
            startGame(); // Iniciar un nuevo juego después de volver a oscurecer la imagen
        }, 2000); // Duración en milisegundos (2 segundos en este caso)
    }

    async function startGame() {
        const pokemonImage = document.getElementById("pokemon-image");
        pokemonImage.src = await getRandomPokemon(); // Establece la URL de la imagen

        // Fuerza una nueva presentación de la imagen para aplicar el brillo del 0%
        pokemonImage.style.display = 'none';
        pokemonImage.offsetHeight; // Esto provoca una nueva presentación
        pokemonImage.style.display = 'block';

        const options = await generateOptions(pokemonName); // Utiliza pokemonName aquí
        displayOptions(options, capitalizeFirstLetter(pokemonName)); // Utiliza el nombre del Pokémon como nombre correcto
    }

    startGame();
});
