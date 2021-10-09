// on récupere express dans notre code 
const express = require('express')

// on import le pack morgan
const morgan = require('morgan')

// on import le pack favicon
const favicon = require('serve-favicon')

// on import le pack body-parser
const bodyParser = require('body-parser')

// on import sequelize
const { Sequelize, DataTypes } = require('sequelize')

// on recupere le module helper de success et on ajoute l'importation
const { success, getUniqueId } = require('./helper.js')

// on importe notre liste de pokemon
let pokemons = require('./mock-pokemon')

const PokemonModel = require('./src/models/pokemon')

// on creer une instance de l'application express (server web sur laquel va fonctionner notre api rest)
const app = express()
    // port sur lequel on va demarer notre api
const port = 3000


const sequelize = new Sequelize('pokedex', 'root', '$coca10$', {
    host: 'localhost',
    dialect: 'mariadb',
    dialectOptions: {
        timezone: 'Etc/GMT-2',
    },
    logging: false
})

sequelize.authenticate()
    .then(_ => console.log('La connexion à la base de données a bien été établie.'))
    .catch(error => console.error(`Impossible de se connecter à la base de données ${error}`))


const Pokemon = PokemonModel(sequelize, DataTypes)

sequelize.sync({ force: true })
    .then(_ => console.log('La base de données "Pokedex" a bien été synchronisée.'))
    // middleware use de favicon pour faire apparaitre l'icon
    // middleware use de morgan pour debegguer la fase de developpement des requetes HTTP
    // middleware use body-parser
app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(express.json())

// methode get point de terminaison de l'API
app.get('/', (req, res) => res.send('Hello Express 2 !'))

// On retourne la liste des pokemons au format JSON avec un message
app.get('/api/pokemons', (req, res) => {
    const message = 'La liste des pokemeons a bien été récupérée.'
    res.json(success(message, pokemons))
})

// on utilse la liste de pokémons dans notre point de terminaison :
app.get(`/api/pokemons/:id`, (req, res) => {
    // on parametre notre 'id' string en number avec parse.Int
    const id = parseInt(req.params.id)
        // on utilse la methode javaScritp ES6 find pour récupérer un pokémon en fonction d'un certaine condition on cherche le meme pokemon dans l'url pokemon.id === id
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
        // on envoie la reponse au format json
    const message = 'Un pokémon a bien été trouvé'
        // on renvoie une reponse http au format json et on renvoie un message avec les données du pokemon
    res.json(success(message, pokemon))
})

// methode post d'un pokemon avec l'url associé
app.post('/api/pokemons', (req, res) => {
    // on definie un id unique
    const id = getUniqueId(pokemons)
        // on fusionne le new pokemon avec la bd avec une date de création
    const pokemonCreated = {...req.body, ... { id: id, created: new Date() } }
        // on ajoute le pokemon a la liste des autres pokemon
    pokemons.push(pokemonCreated)
        // on genère un message de confirmation du new pokemon
    const message = `Le pokemon ${pokemonCreated.name} a bien été crée.`
    res.json(success(message, pokemonCreated))

})


// methode put d'un pokemon avec l'url associé
app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonUpdated = {...req.body, id: id }
    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon
    })
    const message = `Le pokemon ${pokemonUpdated.name} a bien été modifié.`
    res.json(success(message, pokemonUpdated))
})

// methode delete d'un pokemon avec l'url associé
app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id)
    pokemons = pokemons.filter(pokemon => pokemon.id !== id)
    const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`
    res.json(success(message, pokemonDeleted))
})

// Le nouveau point de terminaison, affichant le nombre total de pokemon
// app.get('/api/pokemons', (rep, res) => {
//     res.send(`Il y a ${pokemons.length} pokemons dans le pokédex pour le moment.`)
// })

// on demare lAPI sur le port 3000 avec un message dans le terminal grace a listen d'express 
app.listen(port, () => console.log(`Notre application Node est démarrée sur: http: //localhost:${port}`))