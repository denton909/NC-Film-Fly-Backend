const db = require('../connection')
const bcrypt = require("bcrypt")

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

function userPasswordCheck(user){

    const values = [user.username]
    const storedUser = []

    return db.query('SELECT * FROM users WHERE username = $1;', values)
    .then(({rows}) => {
            storedUser.push(rows[0])
            return rows[0].password
    })
    .then((password)=> {
            return bcrypt.compare(user.password, password)
    })
    .then((response)=> {
        if (response === true){
            return storedUser
        } else {
            throw new Error('Unauthorized Password')
        }
    })
        
}

function createUser(user) {
      

        return bcrypt.hash(user.password, 10).then((response)=> {
            
            return response
        }).then((encryptedPassword)=>{
           
             const values = [user.name, user.username, user.email_address, user.password, {}, {pref: []}, {pref: []}, {}, {pref: []}, {}, {liked: []}, {disliked: []}, {history: []} ]
             
              return db.query('INSERT INTO users (name, username, email_address, password, genre_scores, genre_pref, actor_pref, actor_scores, director_pref, director_scores, liked_movies, disliked_movies, watched_recently) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *;', values)
        }).then(({rows})=>{
            
            return rows
        })
        
}

function updateUser(pref, user, query) {
    
    if(Object.keys(query).length === 0){
    let test = {
                genre_scores : {                
                "Action": 50,
                "Adventure": 50,
                "Fantasy": 50,
                "Science Fiction": 50,
                "Crime": 50,
                "Drama": 50,
                "Thriller": 50,
                "Animation": 50,
                "Family": 50,
                "Western": 50,
                "Romance": 50,
                "Comedy": 50,
                "Horror": 50,
                "Mystery": 50,
                "History": 50,
                "War": 50,
                "Music": 50,
                "Documentary": 50,
                "Foreign": 50,
                "TV Movie": 50},
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
        return idCheck(user, rows)

    })
} else if (query.update === "watched_recently"){
    return db.query(`SELECT watched_recently FROM users WHERE user_id = 2;`).then(({rows})=> {
        
        return rows[0]
    }).then((rows)=> {
        rows.watched_recently.history.push(pref.watched_recently)
        const values = [rows.watched_recently, user]
       return db.query(`UPDATE users SET watched_recently= $1 WHERE user_id = $2 RETURNING *;`, values)
        
    }).then(({rows})=> {
        return rows
    })
   
} else if (query.update === "likes"){
    return db.query(`SELECT liked_movies, disliked_movies FROM users WHERE user_id = 2;`).then(({rows})=> {
        
        return rows[0]
    }).then((rows)=> {
        if(pref.liked.length === 0){
            rows.disliked_movies.disliked.push(pref.disliked)
        } else if (pref.disliked.length === 0){
            rows.liked_movies.liked.push(pref.liked)
        } else {
            rows.liked_movies.liked.push(pref.liked)
            rows.disliked_movies.disliked.push(pref.disliked)
        }


       
        const values = [rows.liked_movies, rows.disliked_movies, user]
       return db.query(`UPDATE users SET liked_movies= $1, disliked_movies = $2 WHERE user_id = $3 RETURNING *;`, values)
        
    }).then(({rows})=> {
        return rows
    })
}
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

function removeUser (user) {
   
    return db.query(`DELETE FROM users WHERE user_id = $1 `, [user])
    
}




module.exports = { retrieveUser, createUser, updateUser, updateMovie, removeUser, userPasswordCheck}