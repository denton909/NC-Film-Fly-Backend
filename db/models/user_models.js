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
        
            return idCheck(id, rows[0])
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
    const values = [pref.genre_scores, pref.genre_pref, pref.actor_pref, pref.actor_scores, pref.director_pref, pref.director_scores, pref.liked_movies, pref.disliked_movies, pref.watched_recently, user]
    return db.query('UPDATE users SET genre_scores = $1, genre_pref = $2, actor_pref = $3, actor_scores = $4, director_pref = $5, director_scores = $6, liked_movies = $7, disliked_movies = $8, watched_recently = $9 WHERE username = $10 RETURNING *;', values)
    .then(({rows})=> {
        return rows

    })
}




module.exports = { retrieveUser, createUser, updateUser }