document.addEventListener("DOMContentLoaded", function () {
    const gameConfig = {
        // Puedes agregar configuración aquí si es necesario.
    };
    let pokemonName; // Definir pokemonName en el ámbito global

    async function getRandomPokemonId() {
        return Math.floor(Math.random() * 151) + 1;
    }

    async function getRandomPokemon() {
        const pokemonId = await getRandomPokemonId();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const data = await response.json();
        return data;
    }

    async function getAllFirstGenPokemonNames() {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const data = await response.json();
        return data.results.map((pokemon) => capitalizeFirstLetter(pokemon.name));
    }

    function getRandomUniquePokemonName(names, correctName) {
        let randomName;
        do {
            randomName = names[Math.floor(Math.random() * names.length)];
        } while (randomName === correctName);
        return randomName;
    }

    async function generateOptions(correctName) {
        const allFirstGenPokemonNames = await getAllFirstGenPokemonNames();
        const options = [correctName];

        while (options.length < 4) {
            const randomName = getRandomUniquePokemonName(allFirstGenPokemonNames, correctName);
            options.push(randomName);
        }

        pokemonName = correctName; // Asignar el valor de pokemonName aquí
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
                if (option === correctName) {
                    showResponseMessage("¡Correcto!", true);
                    startGame();
                } else {
                    showResponseMessage("¡Incorrecto! Intenta de nuevo.", false);
                }
            });
        });
    }

    function showResponseMessage(message, isCorrect) {
        const responseMessage = document.getElementById("response-message");
        responseMessage.textContent = message;

        if (isCorrect) {
            responseMessage.style.backgroundColor = "#007BFF"; // Color para respuesta correcta
        } else {
            responseMessage.style.backgroundColor = "#FF5722"; // Color para respuesta incorrecta
        }

        responseMessage.classList.add("in"); // Agregar clase 'in' para mostrar el cartel
        setTimeout(() => {
            responseMessage.classList.remove("in"); // Quitar clase 'in' después de 2 segundos
            responseMessage.classList.add("out"); // Agregar clase 'out' para ocultar el cartel
        }, 2000); // Duración de la animación (en milisegundos)
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    async function startGame() {
        const pokemon = await getRandomPokemon();
        pokemonName = capitalizeFirstLetter(pokemon.name); // Asignar el valor de pokemonName aquí
        const pokemonImageURL = pokemon.sprites.front_default; // Obtener la URL del sprite

        const pokemonImage = document.getElementById("pokemon-image");
        pokemonImage.src = pokemonImageURL;

        const options = await generateOptions(pokemonName);
        displayOptions(options, pokemonName);
    }

    startGame();
});
