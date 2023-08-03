const db = require('../connection')
const { retrieveUser } = require('../models/user_models')
const {increaseScore, decreaseScore} = require('../algorithm/math-components')

function retrieveRecs (id){
    return retrieveUser(id).then((response) => {
        return response
    })
    .then((response) => {
        const genreScores = response.genre_scores
        // const directorScores = response.director_scores
        const genreKeys = Object.keys(genreScores)

        const genresArray = genreKeys.map((genre)=> {
        const upperCase = genre.substring(0, 1).toUpperCase()
        const LowerCase = genre.slice(1)
        const wordWithCapitalLetter = upperCase + LowerCase
       
          return '%' + wordWithCapitalLetter + '%'
        })
       
        const stringArray = JSON.stringify(genresArray)
        const queryString = stringArray.replaceAll(`"`, `'`)

       return db.query(`SELECT * FROM movies WHERE genres LIKE ANY (ARRAY ${queryString}) `).then(({rows}) => {
        // console.log(rows)
        return response
       })

    
       
    })
    .then((userPref)=> {
        const actorScores = userPref.actor_scores
        const actorKeys = Object.keys(actorScores)
        
        const actorsArray = actorKeys.map((actor)=> {
            const upperCase = actor.substring(0, 1).toUpperCase()
            const LowerCase = actor.slice(1)
            const wordWithCapitalLetter = upperCase + LowerCase
           
              return '%' + wordWithCapitalLetter + '%'
            })
            const stringArray = JSON.stringify(actorsArray)
            const queryString = stringArray.replaceAll(`"`, `'`)

            return db.query(`SELECT * FROM crew WHERE "cast" LIKE ANY (ARRAY ${queryString}) `).then(({rows}) => {
                // console.log(rows)
                return response
               })

    })
}


module.exports = { retrieveRecs }

