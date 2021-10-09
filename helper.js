const pokemons = require("./mock-pokemon")

// methode succes avec un message et les données pour le consomateur et on export le message
exports.success = (message, data) => {
    return { message, data }
}

// on genere la methode d'ajout d'un new pokemon avec un new id
exports.getUniqueId = (pokemons) => {
    // on transfome le tableau des pokemons en tableau id des pokemons avec la methode map 
    const pokemonsIds = pokemons.map(pokemon => pokemon.id)
        // on calcule l'id le + grand parmi la liste des pokemons excitantavec la methode reduce et nous retour la const maxId
    const maxId = pokemonsIds.reduce((a, b) => Math.max(a, b))
        // on incremente id a maxId de 1
    const uniqueId = maxId + 1

    return uniqueId
}