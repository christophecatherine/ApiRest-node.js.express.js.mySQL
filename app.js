// on récupere express dans notre code 
const express = require('express')

// on import le pack favicon
// const favicon = require('serve-favicon')

// on import le pack body-parser
const bodyParser = require('body-parser')

// on import le pack sequelize
const sequelize = require('./src/db/sequelize')

// on creer une instance de l'application express (server web sur laquel va fonctionner notre api rest)
const app = express()
    // port sur lequel on va demarer notre api
const port = process.env.PORT || 3000

// middleware use de favicon pour faire apparaitre l'icon
// middleware use body-parser
app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(express.json())

// on appelle notre methode init db
sequelize.initDb()

app.get('/', (req, res) => {
    res.json('Hello, Heroku ! 👋')
})

// ici nous placerons nos futurs points de terminaison
require('./src/routes/findAllPokemons')(app)
require('./src/routes/findPokemonByPk')(app)
require('./src/routes/createPokemon')(app)
require('./src/routes/updatePokemon')(app)
require('./src/routes/deletePokemon')(app)
require('./src/routes/login')(app)

// on ajoute la gestion des erreus 404
app.use(({ res }) => {
    const message = 'Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL. '
    res.status(404).json({ message })
})

// on demare lAPI sur le port 3000 avec un message dans le terminal grace a listen d'express 
app.listen(port, () => console.log(`Notre application Node est démarrée sur: http: //localhost:${port}`))