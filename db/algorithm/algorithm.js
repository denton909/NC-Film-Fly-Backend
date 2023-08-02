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

        // console.log(genreScores, actorScores, directorScores)
        // get movie where --> genre something something  
    











        return response
    })
}


module.exports = { retrieveRecs }

