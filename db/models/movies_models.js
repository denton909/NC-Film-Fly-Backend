const format = require('pg-format')
const db = require('../connection')

function retrieveGenres (){
    return db.query('SELECT genres FROM movies').then(({rows})=> {
        
        return rows
    })
    .then((rows)=> {
        let result = {}
        rows.forEach((row) => {
            const genres = JSON.parse(row.genres)
            
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
    return db.query('SELECT crew FROM crew').then(({rows})=> {
        return rows
    })
    .then((rows)=> {
        
        let result = {}
        rows.forEach((row)=> {
            const parsedCrew = JSON.parse(row.crew)
            parsedCrew.forEach((crew, index)=>{
              if(crew.job === "Director" && result[crew.name] === undefined){
                result[crew.name] = 1
              } else if (crew.job === "Director" && result[crew.name]){
                result[crew.name]++
              } 
            })
        })
        
       
       
        return result
        
    })
    .then((result)=>{
        let directorArray = []
        for(const director in result){
            directorArray.push([director, result[director]])
        }
       console.log(directorArray)
        return directorArray
    })
    .then ((directorArray)=> {
        const queryString = format('INSERT INTO directors (name, number_of_films) VALUES %L RETURNING *;', directorArray.map((director) => director))
        return db.query(queryString)
    })
    .then(({rows})=>{
        return db.query('SELECT * FROM directors ORDER BY number_of_films DESC LIMIT 50')
    })
    .then(({rows})=>{
        return rows
    })


}

function retrieveActors (){
    return db.query('SELECT "cast" FROM crew').then(({rows})=> {
        return rows
    })
    .then((rows)=> {
        
        let result = {}
        rows.forEach((row)=> {
            const parsedCast = JSON.parse(row.cast)
            parsedCast.forEach((cast, index)=>{
              if(result[cast.name] === undefined){
                result[cast.name] = 1
              } else if (result[cast.name]){
                result[cast.name]++
              } 
            })
        })
        
       
       
        return result
        
    })
    .then((result)=>{
        let actorsArray = []
        for(const actor in result){
            actorsArray.push([actor, result[actor]])
        }
      
        return actorsArray
    })
    .then ((actorsArray)=> {
        const queryString = format('INSERT INTO actors (name, number_of_films) VALUES %L RETURNING *;', actorsArray.map((actor) => actor))
        return db.query(queryString)
    })
    .then(({rows})=>{
        return db.query('SELECT * FROM actors ORDER BY number_of_films DESC LIMIT 50')
    })
    .then(({rows})=>{
       
        return rows
    })


}

module.exports = {retrieveGenres, retrieveDirectors, retrieveActors}