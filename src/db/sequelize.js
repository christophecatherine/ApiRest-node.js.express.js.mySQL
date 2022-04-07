const { Sequelize, DataTypes } = require('sequelize')
const PokemonModel = require('../models/pokemon')
const UserModel = require('../models/user')
const pokemons = require('./mock-pokemon')
const bcrypt = require('bcrypt')

let sequelize

if (process.env.NODE_ENV === 'production') {
    const sequelize = new Sequelize('czdwdk89gtgyc5lf', 't8ye54rfia9oqv98', 'hv2wupd6pnscsuqr', {
        host: 'uyu7j8yohcwo35j3.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT-2',
        },
        logging: true
    })
} else {
    sequelize = new Sequelize('pokedex', 'root', '', {
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT-2',
        },
        logging: false
    })
}



// on instancie les models auprès de sequelize
const Pokemon = PokemonModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)

const initDb = () => {
    return sequelize.sync().then(_ => {
        pokemons.map(pokemon => {
            Pokemon.create({
                name: pokemon.name,
                hp: pokemon.hp,
                cp: pokemon.cp,
                picture: pokemon.picture,
                types: pokemon.types
            }).then(pokemon => console.log(pokemon.toJSON()))
        })


        bcrypt.hash('pikachu', 10)
            // on pousse un nouvelle utilisateur dans notre base de donnée mySql grace à create
            .then(hash => User.create({ username: 'pikachu', password: hash }))
            .then(user => console.log(user.toJSON()))

        console.log('La base de donnée a bien été initialisée !')
    })
}

module.exports = {
    initDb,
    Pokemon,
    User
}