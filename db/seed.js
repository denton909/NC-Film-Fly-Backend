const format = require('pg-format')
const db = require('./connection')
const csvPath = String(__dirname)+'/csv_files/movies.csv'
const users = require('./user_data/test_data')
//yo


const seed = () => {
    return db.query('DROP TABLE IF EXISTS movies')
    .then(() => {
        return db.query('DROP TABLE IF EXISTS users')
    })
    .then(()=> {
        return db.query('CREATE TABLE movies (budget INT, genres TEXT, homepage TEXT, id INT, keywords TEXT, original_language TEXT, original_title TEXT, overview TEXT, popularity TEXT, production_companies TEXT, production_countries TEXT, release_date DATE, revenue BIGINT, runtime TEXT, spoken_languages TEXT, status TEXT, tagline TEXT, title TEXT, vote_average TEXT, vote_count INT)')
    })
    .then(()=>{
        return db.query('CREATE TABLE users (user_id SERIAL PRIMARY KEY, username TEXT, genre_scores TEXT, genre_pref TEXT, actor_pref TEXT, actor_scores TEXT, director_pref TEXT, director_scores TEXT, liked_movies TEXT, disliked_movies TEXT, watched_recently TEXT)')
    })
    .then(()=> {
        return db.query(`COPY movies (budget, genres, homepage, id, keywords, original_language, original_title, overview, popularity, production_companies, production_countries, release_date, revenue, runtime, spoken_languages, status, tagline, title, vote_average, vote_count) FROM '/Users/charlieheseltine/NC-Film-Fly-Backend/db/csv_files/movies.csv' DELIMITER ',' CSV HEADER;`)
    })
    .then(()=> {
        const query =  format(`INSERT INTO users (username, genre_scores, genre_pref, actor_pref, actor_scores, director_pref, director_scores, liked_movies, disliked_movies, watched_recently) VALUES %L;`, users().map((user) => {

            return [user.username, user.genre_scores, user.genre_pref, user.actor_pref, user.actor_scores, user.director_pref, user.director_scores, user.liked_movies, user.disliked_movies, user.watched_recently]
        } ))
        
        return db.query(query)
    })


}

module.exports = seed