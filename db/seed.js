const format = require('pg-format')
const db = require('./connection')
// const csvPath = String(__dirname)+'/csv_files/movies.csv'
const movies = require('./csv_files/movies.json')

const crew = require('./csv_files/crew.json')
const users = require('./user_data/test_data')
const directors = require('./csv_files/directors.json')

const actors = require('./csv_files/actors.json')
const test = require('./csv_files/test.json')



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

        return db.query('DROP TABLE IF EXISTS recommendations')
        
    })
    .then(()=> {

        return db.query('DROP TABLE IF EXISTS test_table')
        
    })
    .then(()=> {
        console.log('in create')
        return db.query('CREATE TABLE movies (budget INT, genres TEXT, homepage TEXT, id INT, keywords JSONB, original_language TEXT, original_title TEXT, overview TEXT, popularity VARCHAR, production_companies JSONB, production_countries JSONB, release_date TEXT, revenue BIGINT, runtime INT, spoken_languages JSONB, status TEXT, tagline TEXT, title TEXT, vote_average FLOAT, vote_count INT)')
    })
    .then(()=>{

        return db.query('CREATE TABLE users (user_id SERIAL PRIMARY KEY, name VARCHAR(30), username VARCHAR(30) NOT NULL, email_address VARCHAR(50) NOT NULL, password VARCHAR(30) NOT NULL, genre_scores JSONB, genre_pref JSONB, actor_pref JSONB, actor_scores JSONB, director_pref JSONB, director_scores JSONB, liked_movies JSONB, disliked_movies JSONB, watched_recently JSONB)')
    })
    .then(()=> {
        
        return db.query('CREATE TABLE crew (movie_id INT, title TEXT, "cast" TEXT, crew JSONB)')
    })
    .then(()=> {
        return db.query('CREATE TABLE directors (director_id SERIAL PRIMARY KEY, name TEXT, number_of_films INT)')
    })
    .then(()=> {
        return db.query('CREATE TABLE actors (actor_id SERIAL PRIMARY KEY, name TEXT, number_of_films INT)')
    })
    .then(()=> {
        return db.query('CREATE TABLE test_table (id SERIAL PRIMARY KEY, name TEXT, genres JSONB)')
    })
    .then(()=> {

        const query = format(`INSERT INTO movies (budget, genres, homepage, id, keywords, original_language, original_title, overview, popularity, production_companies, production_countries, release_date, revenue, runtime, spoken_languages, status, tagline, title, vote_average, vote_count) VALUES %L;`, movies.map((movie) => {

            return [movie.budget, movie.genres, movie.homepage, movie.id, movie.keywords, movie.original_language, movie.original_title, movie.overview, movie.popularity, movie.production_companies, movie.production_countries, movie.release_date, movie.revenue, movie.runtime, movie.spoken_languages, movie.status, movie.tagline, movie.title, movie.vote_average, movie.vote_count]
        }))
        
        return db.query(query)
            
    })
    .then(()=> {
  
        const query =  format(`INSERT INTO users (name, username, email_address, password, genre_scores, genre_pref, actor_pref, actor_scores, director_pref, director_scores, liked_movies, disliked_movies, watched_recently) VALUES %L;`, users().map((user) => {

            return [user.name, user.username, user.email_address, user.password, user.genre_scores, user.genre_pref, user.actor_pref, user.actor_scores, user.director_pref, user.director_scores, user.liked_movies, user.disliked_movies, user.watched_recently]
        } ))
        
        return db.query(query)
    })
    .then(()=> {
        const query = format(`INSERT INTO crew (movie_id, title, "cast", crew) VALUES %L;`, crew.map((obj)=> {
            return [obj.movie_id, obj.title, obj.cast, obj.crew]
        }))

        return db.query(query)
        
    })
    .then(() => {
        return db.query(format('INSERT INTO directors (name, number_of_films) VALUES %L;', directors.map((director) => {
            return [director.name, director.number_of_films]
        })))
    })
    .then(() => {
        return db.query(format('INSERT INTO actors (name, number_of_films) VALUES %L;', actors.map((actor) => {
            return [actor.name, actor.number_of_films]
        })))
    })
    .then(() => {
        
        return db.query(format('INSERT INTO test_table (name, genres) VALUES %L;', test.map((testArticle) => {
            return [testArticle.name, JSON.stringify(testArticle.genres)]
        })))
    })



}

module.exports = seed

