const format = require('pg-format')
const db = require('./connection')
const csvPath = String(__dirname)+'/csv_files/movies.csv'
const users = require('./user_data/test_data')
//yo

console.log(csvPath)

const seed = () => {
    return db.query('DROP TABLE IF EXISTS movies')
    .then(() => {
        return db.query('DROP TABLE IF EXISTS users')
    })
    .then(()=> {
        return db.query('DROP TABLE IF EXISTS crew')
    })
    .then(()=> {
        return db.query('DROP TABLE IF EXISTS actors')
    })
    .then(()=> {
        return db.query('DROP TABLE IF EXISTS directors')
    })
    .then(()=> {
        return db.query('CREATE TABLE movies (budget INT, genres TEXT, homepage TEXT, id INT, keywords TEXT, original_language TEXT, original_title TEXT, overview TEXT, popularity TEXT, production_companies TEXT, production_countries TEXT, release_date DATE, revenue BIGINT, runtime TEXT, spoken_languages TEXT, status TEXT, tagline TEXT, title TEXT, vote_average TEXT, vote_count INT)')
    })
    .then(()=>{
        return db.query('CREATE TABLE users (user_id SERIAL PRIMARY KEY, name VARCHAR(30), username VARCHAR(30) NOT NULL, email_address VARCHAR(50) NOT NULL, password VARCHAR(30) NOT NULL, genre_scores TEXT, genre_pref TEXT, actor_pref TEXT, actor_scores TEXT, director_pref TEXT, director_scores TEXT, liked_movies TEXT, disliked_movies TEXT, watched_recently TEXT)')
    })
    .then(()=> {
        return db.query('CREATE TABLE crew (movie_id INT, title TEXT, "cast" TEXT, crew TEXT)')
    })
    .then(()=> {
        return db.query('CREATE TABLE directors (director_id SERIAL PRIMARY KEY, name TEXT, number_of_films INT)')
    })
    .then(()=> {
        return db.query('CREATE TABLE actors (actor_id SERIAL PRIMARY KEY, name TEXT, number_of_films INT)')
    })
    .then(()=> {
        return db.query(`COPY movies (budget, genres, homepage, id, keywords, original_language, original_title, overview, popularity, production_companies, production_countries, release_date, revenue, runtime, spoken_languages, status, tagline, title, vote_average, vote_count) FROM '/Users/Phil/Desktop/NorthCoders/CourseWork/BE-Film-Fly/db/csv_files/movies.csv' DELIMITER ',' CSV HEADER;`)
    })
    .then(()=> {
        const query =  format(`INSERT INTO users (name, username, email_address, password, genre_scores, genre_pref, actor_pref, actor_scores, director_pref, director_scores, liked_movies, disliked_movies, watched_recently) VALUES %L;`, users().map((user) => {

            return [user.name, user.username, user.email_address, user.password, user.genre_scores, user.genre_pref, user.actor_pref, user.actor_scores, user.director_pref, user.director_scores, user.liked_movies, user.disliked_movies, user.watched_recently]
        } ))
        
        return db.query(query)
    })
    .then(()=> {
        return db.query(`COPY crew (movie_id, title, "cast", crew) FROM '/Users/Phil/Desktop/NorthCoders/CourseWork/BE-Film-Fly/db/csv_files/crew.csv' DELIMITER ',' CSV HEADER;`)
    })


}

module.exports = seed