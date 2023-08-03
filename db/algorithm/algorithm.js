const db = require('../connection')
const { retrieveUser } = require('../models/user_models')
const {increaseScore, decreaseScore} = require('../algorithm/math-components')

function retrieveRecs (id){
    // console.log(fetch())
    return retrieveUser(id).then((response) => {
        return response
    })
    .then((response) => {
        const genreScores = response.genre_scores
        const actorScores = response.actor_scores
        const directorScores = response.director_scores
        const genreKeys = Object.keys(genreScores)
        // console.log(genreKeys)
        // return db.query(`SELECT * FROM movies WHERE original_title = 'The Polar Express';`).then(({rows}) => {
        //     console.log(rows)
        //     return rows
        // })

        return db.query(`SELECT * FROM movies WHERE genres ->> 0 = '{"id": 14, "name": "Fantasy"}';`).then(({rows}) => {
            console.log(rows)
            return rows
        })

        // db.query(`SELECT * FROM movies WHERE genres ->> 0 = '{"name": "Comedy"}' OR genres ->> 1 = '{"name": "Comedy"}' ;`)



        // console.log(genreScores, actorScores, directorScores)
    }).then((response) => {
        console.log(response)
    })
}


module.exports = { retrieveRecs }

