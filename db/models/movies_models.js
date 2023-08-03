const format = require('pg-format')
const db = require('../connection')

function retrieveGenres (){
    return db.query('SELECT genres FROM movies').then(({rows})=> {
        
        return rows
    })
    .then((rows)=> {
        let result = {}
        rows.forEach((row) => {
            const genres = (row.genres)
            
            genres.forEach((genre)=> {
                if(result[genre.name] === undefined){
                    result[genre.name] = 1
                    result.id = genre.id
                } else {
                    result[genre.name]++
                }
                
            })
        })
        return {genres: result}
    })

}

function retrieveDirectors (){
        return db.query('SELECT name FROM directors ORDER BY number_of_films DESC')
 
    .then(({rows})=>{
        const directorList = []
        rows.forEach((row) => {
            directorList.push(row.name)
        })
        return {directors: directorList}
    })


}

function retrieveActors (){

    return db.query('SELECT name FROM actors ORDER BY number_of_films DESC')
    .then(({rows})=>{
        const actorList = []
        rows.forEach((row) => {
            actorList.push(row.name)
        })
        return {actors: actorList}
    })

}

module.exports = {retrieveGenres, retrieveDirectors, retrieveActors}