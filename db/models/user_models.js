const db = require('../connection')

function idCheck(id, rows) {
    const values = [id]

   if (rows.length === 0) {
    return db.query(`SELECT * FROM users WHERE user_id = $1;`, values).then(({rows}) => {

        return rows
    })
    .then((rows) => {
        if(rows.length !== 0){

            return Promise.reject('Error: 200 - No results')
            
        }
        else {

           return Promise.reject('Error: 404 - Not Found')
        }
    })
   }
   else return rows
}

function retrieveUser(id){
    const values = [id]

    return db.query('SELECT * FROM users WHERE user_id = $1;', values)
        .then(({rows}) => {
        
            return idCheck(id, rows)
        })
}

function createUser(user) {
        const values = [user.name, user.username, user.email_address, user.password, {}, {pref: []}, {pref: []}, {}, {pref: []}, {}, {liked: []}, {disliked: []}, {history: []} ]
        return db.query('INSERT INTO users (name, username, email_address, password, genre_scores, genre_pref, actor_pref, actor_scores, director_pref, director_scores, liked_movies, disliked_movies, watched_recently) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *;', values)
        .then(({rows})=> {
            
            return rows

        })
}

function updateUser(pref, user) {
    
    let test = {
                genre_scores : {}, 
                genre_pref : { pref : []}, 
                actor_pref : { pref : []},  
                actor_scores : {},  
                director_pref : { pref : []}, 
                director_scores : {},
                liked_movies : {liked : []}, 
                disliked_movies : { disliked : []},
                watched_recently : { history : []}
    }
    
    pref.genres.forEach(genre => {
        
        test.genre_pref.pref.push(genre)
        test.genre_scores[genre] = 75
    })
    pref.actors.forEach(actor => {
       
        test.actor_pref.pref.push(actor)
        test.actor_scores[actor] = 75
    })
    pref.directors.forEach(director => {
        test.director_pref.pref.push(director)
        test.director_scores[director] = 75
    })

    
    const values = [test.genre_scores, test.genre_pref, test.actor_pref, test.actor_scores, test.director_pref, test.director_scores, test.liked_movies, test.disliked_movies, test.watched_recently, user]
    return db.query('UPDATE users SET genre_scores = $1, genre_pref = $2, actor_pref = $3, actor_scores = $4, director_pref = $5, director_scores = $6, liked_movies = $7, disliked_movies = $8, watched_recently = $9 WHERE user_id = $10 RETURNING *;', values)
    .then(({rows})=> {
        console.log(rows[0].genre_pref)
        return idCheck(user, rows)

    })
}

function updateMovie({movie}, user) {
    return db.query(`SELECT * from users WHERE username = $1;`, [user]).then(({rows}) => {
        rows[0].watched_recently.history.push(movie.name)
        return rows
    })
    .then((rows) => {
        const values = [rows[0].watched_recently, rows[0].username]
        return db.query('UPDATE users SET watched_recently = $1 WHERE username = $2 RETURNING *', values)
    })
}




module.exports = { retrieveUser, createUser, updateUser, updateMovie }