const express = require('express')
const fs = require('fs/promises')
const { getUsers, getUser } = require('./controllers/user_controllers')
const { getMovies, getRecs } = require('./controllers/movies_controller')


const app = express()

app.get('/api/users', getUsers)

app.get('/api/users/:user_id', getUser)

app.get('/api/movies', getMovies)

app.get('/api/users/:user_id/recommendations', getRecs)



app.use((err, req, res, next) => {
    if (err = 'Error: 404 - Not Found'){
        res.status(404).send('Error: 404 - Not Found')
    }
   
})



const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

module.exports = app