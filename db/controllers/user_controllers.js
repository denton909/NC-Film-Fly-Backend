const db = require('../connection')
const { retrieveUser } = require('../models/user_models')




function getUsers (req, res, next) {

    return db.query(`SELECT * FROM users;`)
        .then(({rows}) => {

            res.status(200).send(rows)
        })
}

function getUser (req, res, next){

    const id = req.params.user_id
  
    retrieveUser(id).then((response) => {
     
        res.status(200).send(response)
    })
    .catch(next)
}

module.exports = { getUsers, getUser }