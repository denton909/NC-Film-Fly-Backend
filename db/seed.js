const format = require('pg-format')
const db = require('./connection')
const csvPath = String(__dirname)+'/csv_files/movies.csv'

console.log(csvPath)

const seed = () => {
    return db.query('DROP TABLE IF EXISTS movies')
    .then(() => {
        return db.query('DROP TABLE IF EXISTS users')
    })
    .then(()=> {
        return db.query('CREATE TABLE movies (budget INT, genres TEXT, homepage TEXT, id INT, keywords TEXT, original_language TEXT, original_title TEXT, overview TEXT, popularity TEXT, production_companies TEXT, production_countries TEXT, release_date DATE, revenue BIGINT, runtime TEXT, spoken_languages TEXT, status TEXT, tagline TEXT, title TEXT, vote_average TEXT, vote_count INT)')
    })
    .then(()=>{
        return db.query('CREATE TABLE users (user_id SERIAL PRIMARY KEY, user_name TEXT, preferred_genres TEXT, preferred_actors TEXT, preferred_directors TEXT, liked_movies TEXT, disliked_movies TEXT)')
    })
    .then(()=> {
        return db.query(`\COPY movies (budget, genres, homepage, id, keywords, original_language, original_title, overview, popularity, production_companies, production_countries, release_date, revenue, runtime, spoken_languages, status, tagline, title, vote_average, vote_count) FROM '/Users/Phil/Desktop/NorthCoders/CourseWork/BE-Film-Fly/db/csv_files/movies.csv' DELIMITER ',' CSV HEADER;`)
    })
    .then(()=> {
        return db.query('INSERT INTO users (user_name, preferred_genres, preferred_actors, preferred_directors, liked_movies, disliked_movies) VALUES %L', users.forEach((user) => {
            return [Object.keys(user)]
        } ))
    })


}

module.exports = seed