const db = require('../connection')
const { retrieveRecs } = require('../algorithm/algorithm')
const { retrieveGenres, retrieveDirectors, retrieveActors } = require('../models/movies_models')

function getMovies(req, res, next) {
    return db.query(`SELECT * FROM movies;`)
    .then(({rows}) => {

        res.status(200).send(rows)
    })
}

function getGenres(req, res, next) {
    retrieveGenres().then((response) => {
        res.status(200).send(response)
    })
}

function getDirectors(req, res, next) {
    retrieveDirectors().then((response) => {
        res.status(200).send(response)
    })
    
}

function getActors(req, res, next) {
    retrieveActors().then((response)=> {
        res.status(200).send(response)

    })
    
    
}

function getRecs(req, res, next) {
    const id = req.params.user_id
    retrieveRecs(id).then((response) => {
        console.log(response)
        res.status(200).send(response)
    })
    .catch(next)
}

module.exports = { getMovies, getRecs, getGenres, getDirectors, getActors}