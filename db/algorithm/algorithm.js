const db = require('../connection')
const format = require('pg-format')
const {
    retrieveUser
} = require('../models/user_models')
const {
    increaseScore,
    decreaseScore,
    decreaseScoreByHalf
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
                }
                if (i === actorKeys.length - 1 && directorAsks.length > 0) {
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
                }
                if (i === genreKeys.length - 1 && (actorAsks.length > 0 || directorAsks.length > 0)) {
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

function updateScores(pref, user) {
    let movieName = ''
    let liked = false
    let disliked = false

    if (pref.liked.length > 0) {
        movieName += pref.liked
        liked = true
    } else if (pref.disliked.length > 0) {
        movieName += pref.disliked
        disliked = true
    }
    console.log("user before", user)

    return db.query(`SELECT * FROM users WHERE user_id = ${user}`).then(({
        rows
    }) => {
        user = rows
        return db.query(`SELECT movies.title, movies.genres, crew.cast, crew.crew FROM movies INNER JOIN crew on movies.title = crew.title WHERE movies.title = '${movieName}';`)
    }).then(({
        rows
    }) => {
        rows[0].genres.map(genre => {

            if (user[0].genre_pref.pref.includes(genre.name)) {
                if (liked === true) {
                    user[0].genre_scores[genre.name] = increaseScore(user[0].genre_scores[genre.name])
                } else if (disliked === true) {
                    user[0].genre_scores[genre.name] = decreaseScoreByHalf(user[0].genre_scores[genre.name])
                }
                
            } else {
                if (liked === true) {
                    user[0].genre_scores[genre.name] = increaseScore(user[0].genre_scores[genre.name])
                } else if (disliked === true) {
                    user[0].genre_scores[genre.name] = decreaseScore(user[0].genre_scores[genre.name])
                }
            }


            //And then make it so the averages are pushed down a bit - not MVP though
        })

        const first10Actors = rows[0].cast.slice(0, 10) 
        
        first10Actors.map(actor => {
            if (user[0].actor_scores[actor.name] === undefined) {
                if (liked === true) {
                    user[0].actor_scores[actor.name] = 60
                } else if (disliked === true) {
                    user[0].actor_scores[actor.name] = 40
                }
            } else {
                if (user[0].actor_pref.pref.includes(actor.name)) {
                    if (liked === true) {
                        user[0].actor_scores[actor.name] = increaseScore(user[0].actor_scores[actor.name])
                    } else if (disliked === true) {
                        user[0].actor_scores[actor.name] = decreaseScoreByHalf(user[0].actor_scores[actor.name])
                    }
                    
                } else {
                    if (liked === true) {
                        user[0].actor_scores[actor.name] = increaseScore(user[0].actor_scores[actor.name])
                    } else if (disliked === true) {
                        user[0].actor_scores[actor.name] = decreaseScore(user[0].actor_scores[actor.name])
                    }
                }
            }
        })

        const director = rows[0].crew.filter(person => {
            if (person.job === 'Director') {
                return person.name
            }
        })


        if (user[0].director_scores[director[0].name] === undefined) {
            if (liked === true) {
                user[0].director_scores[director[0].name] = 20
            } else if (disliked === true) {
                user[0].director_scores[director[0].name] = 0
            }
        } else {
            if (user[0].director_pref.pref.includes(director[0].name)) {
                if (liked === true) {
                    user[0].director_scores[director[0].name] = increaseScore(user[0].director_scores[director[0].name])
                } else if (disliked === true) {
                    user[0].director_scores[director[0].name] = decreaseScoreByHalf(user[0].director_scores[director[0].name])
                }
                
            } else {
                if (liked === true) {
                    user[0].director_scores[director[0].name] = increaseScore(user[0].director_scores[director[0].name])
                } else if (disliked === true) {
                    user[0].director_scores[director[0].name] = decreaseScore(user[0].director_scores[director[0].name])
                }
            }
        }
        const query = format(`UPDATE users SET genre_scores = %L, actor_scores = %L, director_scores = %L WHERE user_id = ${user[0].user_id};`, [user[0].genre_scores], [user[0].actor_scores], [user[0].director_scores])
        db.query(query)
        console.log("user after", user)
        
        })
}

module.exports = {
    retrieveRecs,
    updateScores
}