const db = require('../connection')
const {
    retrieveUser
} = require('../models/user_models')
const {
    increaseScore,
    decreaseScore
} = require('../algorithm/math-components')

function retrieveRecs(id) {
    let userInfo;

    return retrieveUser(id).then((response) => {
            return response[0]
        })
        .then((response) => {
            userInfo = response
            const genreScores = response.genre_scores
            const actorScores = response.actor_scores
            const directorScores = response.director_scores

            const genreScoreMultiplier = 10
            const actorScoreMultiplier = 5
            const directorScoreMultiplier = 5



            let directorKeys = Object.keys(directorScores)
            const directorKeysNoCapUS = directorKeys.map(director => {
                const directorArr = director.split(" ")
                const directorOut = directorArr.join("_")
                return directorOut.toLowerCase()
            })

            //This one just pulls the users current liked directors
            let directorAsks = ""
            for (let i = 0; i < directorKeys.length; i++) {
                const singleDirectorQuery = `(SELECT COUNT(*)*${directorScores[directorKeys[i]]}*${directorScoreMultiplier} AS ${directorKeysNoCapUS[i]} WHERE EXISTS (SELECT * FROM jsonb_array_elements(crew.cast) AS actor WHERE actor ->> 'name' LIKE '%${directorKeys[i]}%'))`
                directorAsks += singleDirectorQuery
                if (i < directorKeys.length - 1) {
                    directorAsks += ","
                }
            }
            
            let actorKeys = Object.keys(actorScores)
            const actorKeysNoCapUS = actorKeys.map(actor => {
                const actorArr = actor.split(" ")
                const actorOut = actorArr.join("_")
                return actorOut.toLowerCase()
            })
            
            //This one just pulls the users current liked actors - probs more to do here
            let actorAsks = ""
            for (let i = 0; i < actorKeys.length; i++) {
                const singleActorQuery = `(SELECT COUNT(*)*${actorScores[actorKeys[i]]}*${actorScoreMultiplier} AS ${actorKeysNoCapUS[i]} WHERE EXISTS (SELECT * FROM jsonb_array_elements(crew.cast) AS actor WHERE actor ->> 'name' LIKE '%${actorKeys[i]}%'))`
                actorAsks += singleActorQuery
                if (i < actorKeys.length - 1) {
                    actorAsks += ","
                } if (i === actorKeys.length - 1 && directorAsks.length > 0) {
                    actorAsks += ","
                }
            } 

            let genreKeys = Object.keys(genreScores)
            const genreKeysNoCapUS = genreKeys.map(genre => {
                const genreArr = genre.split(" ")
                const genreOut = genreArr.join("_")
                return genreOut.toLowerCase()
            })
           
            let genreAsks = ""
            for (let i = 0; i < genreKeys.length; i++) {
                const singleGenreQuery = `(SELECT COUNT(*)*${genreScores[genreKeys[i]]}*${genreScoreMultiplier} AS ${genreKeysNoCapUS[i]} WHERE EXISTS (SELECT * FROM jsonb_array_elements(movies.genres) AS genre_obj WHERE genre_obj ->> 'name' LIKE '%${genreKeys[i]}%'))`
                genreAsks += singleGenreQuery
                if (i < genreKeys.length - 1) {
                    genreAsks += ","
                } if (i === genreKeys.length - 1 && (actorAsks.length > 0 || directorAsks.length > 0)) {
                    genreAsks += ","
                }
            }
            

            let movieTitleComma = ""
            let innerJoinQuery = ""
            if (genreAsks.length !== 0 || actorAsks.length !== 0 || directorAsks.length !== 0) {
                movieTitleComma += ","
                innerJoinQuery += "INNER JOIN crew on movies.title = crew.title"
            }

            
            const query = `
            SELECT movies.title${movieTitleComma}
            ${genreAsks}
            ${actorAsks}
            ${directorAsks}
            FROM movies
            ${innerJoinQuery};
            `


            return db.query(query)
        })
        .then(({
            rows
        }) => {
            const totalScores = rows.map(film => {    
                let genreScore = 0;
                let genreCount = 0;
                let crewScore = 0;
                let crewCount = 0;
                let totalScore = 0;
                for (let score in film) {
                    let aScore = parseInt(film[score])
                    if (score !== 'title') {
                        if (score === 'war' || score == 'crime' || score == 'drama' || score == 'music' || score == 'action' || score == 'comedy' || score == 'family' || score == 'horror' || score == 'fantasy' || score == 'foreign' || score == 'history' || score == 'mystery' || score == 'romance' || score == 'western' || score == 'tv_movie' || score == 'thriller' || score == 'adventure' || score == 'animation' || score == 'documentary' || score == 'science_fiction') {
                            genreScore += aScore
                            if (aScore > 0) {
                                genreCount++
                            }
                        } else {
                            crewScore += aScore
                            if (aScore > 0) {
                                crewCount++
                            }
                        }
                        if (crewCount === 0) {
                            totalScore = (genreScore / genreCount)
                        } else {
                            totalScore = (crewScore / crewCount) + (genreScore / genreCount)
                        }
                    }
                }
                film.totalScore = totalScore
                return film
            })
            

            const totalScoresFiltered = totalScores.filter(movie => {
                
                if (userInfo.liked_movies.liked.includes(movie.title) || userInfo.disliked_movies.disliked.includes(movie.title)) {
                    
                } else {
                    return movie
                }
            })

            const totalScoresSorted = totalScoresFiltered.sort((a, b) =>
                (a.totalScore < b.totalScore) ? 1 : (a.totalScore > b.totalScore) ? -1 : 0
            )

            

            const top10Recs = totalScoresSorted.slice(0, 10)

            const top10RecsArr = top10Recs.map(rec => {
                return rec.title
            })
            return top10RecsArr
        })

}


module.exports = {
    retrieveRecs
}