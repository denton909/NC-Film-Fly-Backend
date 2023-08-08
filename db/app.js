const express = require('express')
const fs = require('fs/promises')
const { getUsers, getUser, postUsers, patchUsers, patchMovie, deleteUser } = require('./controllers/user_controllers')
const { getMovies, getRecs, getRecsTitles, getGenres, getDirectors, getActors } = require('./controllers/movies_controller')
const getEndpoints = require('./controllers/endpoints_controller')


const app = express()

app.use(express.json())

app.get('/api', getEndpoints)

app.get('/api/users', getUsers)

app.get('/api/users/:user_id', getUser)

app.get('/api/movies', getMovies)

// app.get('/api/movies/:genre', getMoviesByGenre)

app.get('/api/users/:user_id/recommendations', getRecs)

app.get('/api/users/:user_id/recommendations/titles', getRecsTitles)

app.get('/api/movies/genres', getGenres)

app.get('/api/movies/directors', getDirectors)

app.get('/api/movies/actors', getActors)

app.post('/api/users', postUsers)

app.patch('/api/users/:user_id', patchUsers)

app.patch('/api/users/:username/add-movie', patchMovie)

app.delete('/api/users/:user_id', deleteUser)




app.use((err, req, res, next) => {
    if(err.code === '23505'){
        
        res.status(400).send('Error: 400 - Bad Request Username or email address is already used')
    }
    if(err.name === 'TypeError'){
       
        res.status(400).send('Error: 400 - Bad Request Invalid Input Body')
    }

    if (err.code === '22P02') {
        
        res.status(400).send('Error: 400 - Bad Request')
    }
    if (err === 'Error: 404 - Not Found'){
       
        res.status(404).send('Error: 404 - Not Found')
    }
   
})



const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

module.exports = app