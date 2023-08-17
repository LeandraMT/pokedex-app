//Fetching the Pokemons from https://pokedex.org/
let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=100';



    function add(pokemon) {
        pokemonList.push(pokemon)
    }

    function getAll() {
        return pokemonList;
    }


    //Functions to load the list and details of the pokemon API
    function loadList() {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        })
            .then(function (json) {
                json.results.forEach(function (item) {
                    let pokemon =
                    {
                        name: item.name,
                        loadDetails: item.url
                    };
                    add(pokemon);
                });
            })
            .catch(function (e) {
                console.error(e);
            })
    }

    function loadPokemonDetails(pokemon) {
        let url = pokemon.loadDetails;
        return fetch(url).then(function (response) {
            return response.json();
        })
            .then(function (details) {
                //adding the details of the pokemons
                pokemon.imageUrl = details.sprites.front_default;
                pokemon.imageUrlBack = details.sprites.back_default;
                pokemon.height = details.height;
                pokemon.weight = details.weight;
                pokemon.types = details.types.map(type => type.type.name);
                pokemon.abilities = details.abilities.map(ability => ability.ability.name);
            })
            .catch(function (e) {
                console.error(e);
            })
    }

    function pokemonCard(pokemon) {
        let pokemonCard = document.querySelector('.pokemon-card');

        //content for the front
        let cardFront = document.createElement('div');
        cardFront.classList.add('card-front');

        let imageOnCard = document.createElement('img');
        imageOnCard.src = pokemon.imageUrl;
        imageOnCard.classList.add('card-front_image');

        let pokemonName = document.createElement('button');
        pokemonName.innerText = pokemon.name;
        pokemonName.classList.add('buttonName')

        // Add event listener to the pokemonName button
        pokemonName.addEventListener('click', () => {
            console.log('pokemonName clicked:', pokemon.name);
            pokemonModal(pokemon);
        });


        //appending elements
        cardFront.appendChild(imageOnCard);
        cardFront.appendChild(pokemonName);

        pokemonCard.appendChild(cardFront);
    }


    function pokemonModal(pokemon) {
        let modalBody = document.querySelector('.modal-body');
        let modalTitle = document.querySelector('.modal-title');
        let modalHeader = document.querySelector('.modal-header');
        let closeModal = document.querySelector('#closeModal');

        modalBody.innerHTML = '';
        modalHeader.innerHTML = '';
        closeModal.innerHTML = 'x';

        //content for the modal
        let imageOnModal = document.createElement('img');
        imageOnModal.src = pokemon.imageUrlBack;
        imageOnModal.classList.add('image-modal');

        let pokemonHeight = document.createElement('p');
        pokemonHeight.innerText = 'Height: ' + pokemon.height;

        let pokemonWeight = document.createElement('p');
        pokemonWeight.innerText = 'Weight: ' + pokemon.weight;

        let pokemonTypes = document.createElement('p');
        pokemonTypes.innerText = 'Type: ' + pokemon.types;

        let pokemonAbility = document.createElement('p');
        pokemonAbility.innerText = 'Ability: ' + pokemon.abilities;

        //appending elements on modal
        modalBody.appendChild(imageOnModal);
        modalBody.appendChild(pokemonHeight);
        modalBody.appendChild(pokemonWeight);
        modalBody.appendChild(pokemonTypes);
        modalBody.appendChild(pokemonAbility);

        let modalEL = document.getElementById('exampleModal')
        let modal = new bootstrap.Modal(modalEL)
        modal.show()

        //adding event listener to close the modal
        document.getElementById('closeModal').addEventListener('click', () => modal.hide())

    }

    //Adding the search button for the pokemons
    function search_pokemon() {
        let input = document.getElementById('searchbar').value
        input = input.toLowerCase();
        let p = pokemonRepository.getAll();

        let foundPokemon = p.filter(function (pokemon) {
            return pokemon.name.toLowerCase().includes(input);
        });

        if (foundPokemon.length > 0) {
            let pokemonCard = document.querySelector('.pokemon-card');
            pokemonCard.innerHTML = '';

            foundPokemon.forEach(function (pokemon) {
                pokemonRepository.showDetails(pokemon);
            });
        }
        else {
            alert('Could not find matching Pokémon')
        }
    }


    function showDetails(pokemon) {
        loadPokemonDetails(pokemon).then(function () {
            console.log(pokemon)
            pokemonCard(pokemon);
        });
    };


    return {
        add: add,
        getAll: getAll,
        loadList: loadList,
        loadPokemonDetails: loadPokemonDetails,
        pokemonCard: pokemonCard,
        showDetails: showDetails,
        pokemonModal: pokemonModal,
        search_pokemon: search_pokemon
    };

})();

pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.showDetails(pokemon);
    });
});