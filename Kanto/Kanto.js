document.addEventListener("DOMContentLoaded", function () {
    const pokeImage = document.getElementById("pokemon-image");
    let attempts = 0;

    function shakePokemon(iterations, delay) {
        if (iterations <= 0) return;

        setTimeout(() => {
            pokeImage.style.transform = `translateX(${iterations % 2 === 0 ? '5px' : '-5px'})`;
            shakePokemon(iterations - 1, delay);
        }, delay);
    }

    async function getPokemonData(pokemonId, callback) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            const data = await response.json();
            const pokemonName = capitalizeFirstLetter(data.name);
            callback(pokemonName);
        } catch (error) {
            console.error('Error fetching Pokemon data:', error);
        }
    }

    async function getAllFirstGenPokemonNames(callback) {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
            const data = await response.json();
            const pokemonNames = data.results.map((pokemon) => capitalizeFirstLetter(pokemon.name));
            callback(pokemonNames);
        } catch (error) {
            console.error('Error fetching Pokemon names:', error);
        }
    }

    function getRandomPokemonId() {
        return Math.floor(Math.random() * 151) + 1; // Pokémon de la primera generación (Kanto)
    }

    function getRandomPokemon(callback) {
        const pokemonId = getRandomPokemonId();
        const pngUrl = `../assets/png/${String(pokemonId).padStart(3, '0')}.png`;
        getPokemonData(pokemonId, (pokemonName) => {
            callback({
                pngUrl: pngUrl,
                pokemonName: pokemonName
            });
        });
        // Configura la imagen del Pokémon y la animación de revelación después de obtener los datos
        pokeImage.src = pngUrl;
        pokeImage.style.animation = "reveal 1s ease-in-out";
    }

    function generateOptions(correctName, callback) {
        getAllFirstGenPokemonNames((allFirstGenPokemonNames) => {
            const options = [];

            while (options.length < 3) {
                const randomIndex = Math.floor(Math.random() * allFirstGenPokemonNames.length);
                const randomName = allFirstGenPokemonNames[randomIndex];
                if (options.indexOf(randomName) === -1 && randomName !== correctName) {
                    options.push(randomName);
                }
            }

            options.push(correctName);
            callback(shuffleArray(options));
        });
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
                if (!optionsList.classList.contains("disabled")) {
                    attempts++;
    
                    if (option === correctName) {
                        showResponseMessage(`¡Correcto, es ${correctName}!`, true, () => {
                            startGame();
                        });
                        // Marcar la opción correcta en verde
                        listItem.classList.add("correct-option");
                    } else {
                        if (attempts < 3) {
                            showResponseMessage(`¡Incorrecto! Te quedan ${3 - attempts} intentos.`, false, () => {
                                optionsList.classList.remove("disabled");
                            });
                            // Marcar la opción incorrecta en rojo
                            listItem.classList.add("incorrect-option");
                        } else {
                            showResponseMessage(`La respuesta correcta es: ${correctName}`, false, () => {
                                startGame();
                            });
                            shakePokemon(4, 50);
                            optionsList.classList.add("disabled");
                            // Marcar la opción correcta en verde
                            optionsList.querySelector(`.correct-option`).classList.add("correct-option");
                        }
                    }
                    optionsList.classList.add("disabled");
    
                    // Después de un breve intervalo, deseleccionar todas las opciones
                    setTimeout(() => {
                        optionsList.querySelectorAll("li").forEach((item) => {
                            item.classList.remove("correct-option", "incorrect-option");
                        });
                    }, 1000); // Ajusta el tiempo según tus necesidades
                }
            });
        });
    }
    

    function capitalizeFirstLetter(string) {
        return typeof string === 'string' ? string.charAt(0).toUpperCase() + string.slice(1) : '';
    }
    function showResponseMessage(message, isCorrect, callback) {
        const responseMessageInline = document.getElementById("response-message-inline");
        responseMessageInline.textContent = message;
        responseMessageInline.style.backgroundColor = isCorrect ? "#4CAF50" : "#FF5722";
        responseMessageInline.classList.add("show-message");

        setTimeout(() => {
            responseMessageInline.classList.remove("show-message");
            if (typeof callback === "function") {
                callback();
            }
        }, 1500);
    }

    function startGame() {
        attempts = 0;
        const optionsList = document.getElementById("options-list");
        optionsList.classList.remove("disabled");
    
        // Restaurar la visibilidad y la animación de la imagen
        pokeImage.style.display = 'block';
        pokeImage.style.animation = "reveal 3s ease-in-out";
    
        pokeImage.addEventListener("animationend", function animationEndHandler() {
            // Se ejecuta cuando la animación "reveal" ha terminado
            pokeImage.removeEventListener("animationend", animationEndHandler);
    
            getRandomPokemon((data) => {
                pokeImage.src = data.pngUrl;
                generateOptions(data.pokemonName, (options) => {
                    displayOptions(options, data.pokemonName);
                    // Quitar la animación después de mostrar las opciones
                    setTimeout(() => {
                        pokeImage.style.animation = "none";
                    }, 500);
                });
            });
        });
    }
    

    startGame();
});
