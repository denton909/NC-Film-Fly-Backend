const db = require('../connection')

function idCheck(id, rows) {
    const values = [id]

   if (rows.length === 0) {
    return db.query(`SELECT * FROM users WHERE user_id = $1;`, values).then(({rows}) => {

        return rows
    })
    .then((rows) => {
        if(rows.length !== 0){

            return Promise.reject('Error: 200 - No results')
            
        }
        else {

           return Promise.reject('Error: 404 - Not Found')
        }
    })
   }
   else return rows
}

function retrieveUser(id){
    const values = [id]

    return db.query('SELECT * FROM users WHERE user_id = $1;', values)
        .then(({rows}) => {
        
            return idCheck(id, rows[0])
        })
}

module.exports = { retrieveUser }