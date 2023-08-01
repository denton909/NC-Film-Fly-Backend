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
                } else {
                    result[genre.name]++
                }
                
            })
        })

        return Object.keys(result)
    })

}

function retrieveDirectors (){
        return db.query('SELECT name FROM directors ORDER BY number_of_films DESC')
 
    .then(({rows})=>{

        return rows.map((row) => {
            return row.name
        })
    })


}

function retrieveActors (){

    return db.query('SELECT name FROM actors ORDER BY number_of_films DESC')
    .then(({rows})=>{
    
        return rows.map((row) => {
            return row.name
        })
    })


}

module.exports = {retrieveGenres, retrieveDirectors, retrieveActors}