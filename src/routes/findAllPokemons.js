// on import le point de terminaison pokemeon
const { Pokemon } = require('../db/sequelize')
const { Op } = require('sequelize')
const res = require('express/lib/response')
const auth = require('../auth/auth')


module.exports = (app) => {
    app.get('/api/pokemons', auth, (req, res) => {
        // permet a express d'extraire le parametre de requet name de l'url
        if (req.query.name) {
            const name = req.query.name
            const limit = parseInt(req.query.limit) || 5

            if (name.length < 2) {
                const message = 'Le terme de recherche doit contenir au moins 2 caractères.'
                return res.status(400).json({ message })
            }

            return Pokemon.findAndCountAll({
                    where: {
                        name: { //'name' est la propriété du modèle pokémon
                            [Op.like]: `%${name}%` // 'name est le critère de la recherche
                        }
                    },
                    // on trie les requete dans l'ordre alphabetique
                    order: ['name'],
                    // on limit a 5 le nbr de recherche
                    limit: limit
                })
                .then(({ count, rows }) => {
                    const message = `Il y a ${count} pokémons qui correspondent au terme de recherche ${name}.`
                    res.json({ message, data: rows })
                })
        } else {
            Pokemon.findAll({ order: ['name'] })
                .then(pokemons => {
                    const message = 'La liste des pokémons a bien été récupérée.'
                    res.json({ message, data: pokemons })
                })
                .catch(error => {
                    const message = `La liste des pokémons n'a pas pu être récupérée. Réessayez dans quelques instants.`
                    res.status(500).json({ message, data: error })
                })
        }
    })
}