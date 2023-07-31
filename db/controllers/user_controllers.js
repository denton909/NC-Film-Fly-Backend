const db = require('../connection')
const { retrieveUser, createUser, updateUser } = require('../models/user_models')




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

function postUsers (req, res, next) {
    const input = req.body
    createUser(input).then((response)=>{
        return res.status(201).send(response)
    })
    
}

function patchUsers (req, res, next) {
    const input = req.body
    const user = req.params.username
    updateUser(input, user).then((response)=> {
        return res.status(201).send(response)

    })
    
}

module.exports = { getUsers, getUser, postUsers, patchUsers }