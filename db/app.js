const express = require('express')
const fs = require('fs/promises')
const { getUsers, getUser, postUsers, patchUsers, patchMovie } = require('./controllers/user_controllers')
const { getMovies, getRecs, getGenres, getDirectors, getActors } = require('./controllers/movies_controller')
const getEndpoints = require('./controllers/endpoints_controller')
const { getUserTest } = require('./controllers/test_controllers')

const app = express()

app.use(express.json())

app.get('/api', getEndpoints)

app.get('/api/users', getUsers)

app.get('/api/users/:user_id', getUser)

app.get('/api/movies', getMovies)

// app.get('/api/movies/:genre', getMoviesByGenre)

app.get('/api/users/:user_id/recommendations', getRecs)

app.get('/api/movies/genres', getGenres)

app.get('/api/movies/directors', getDirectors)

app.get('/api/movies/actors', getActors)

app.post('/api/users', postUsers)

app.patch('/api/users/:username', patchUsers)

app.patch('/api/users/:username/add-movie', patchMovie)

app.get('/api/test', getUserTest)



app.use((err, req, res, next) => {
    if (err = 'Error: 404 - Not Found'){
        res.status(404).send('Error: 404 - Not Found')
    }
   
})



// const { PORT = 9090 } = process.env;

// app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

module.exports = app