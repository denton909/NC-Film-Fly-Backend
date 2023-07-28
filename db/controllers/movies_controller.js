const db = require('../connection')
const {retrieveRecs} = require('../models/algorithm')

function getMovies(req, res, next) {
    return db.query(`SELECT * FROM movies;`)
    .then(({rows}) => {

        res.status(200).send(rows)
    })
}

function getRecs(req, res, next) {
    const id = req.params.user_id
    retrieveRecs(id).then((response) => {
        res.status(200).send(response)
    })
    .catch(next)
}

module.exports = { getMovies, getRecs }