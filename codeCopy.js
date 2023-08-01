function retrieveActors (){

    return db.query('SELECT "cast" FROM crew').then(({rows})=> {
        return rows
    })
    .then((rows)=> {
        
        let result = {}
        rows.forEach((row)=> {
            const parsedCast = (row.cast)
            
            parsedCast.forEach((cast, index)=>{
              if(result[cast.name] === undefined && index < 6){
                result[cast.name] = 1
              } else if (result[cast.name] && index < 6){
                result[cast.name]++
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
        const queryString = format('INSERT INTO actors (name, number_of_films) VALUES %L RETURNING *;', directorArray.map((director) => director))
        return db.query(queryString)
    })
    .then(({rows})=>{
        return db.query('SELECT DISTINCT name, number_of_films FROM actors WHERE number_of_films > 1 ORDER BY number_of_films DESC;')
    })
    .then(({rows})=>{
        console.log(rows)
        return rows
    })



}

.then(() => {
    return db.query(`COPY crew(movie_id, title, "cast", crew) FROM '/Users/Phil/Desktop/NorthCoders/CourseWork/BE-Film-Fly/db/csv_files/crew.csv' DELIMITER ',' CSV HEADER;`)
 })