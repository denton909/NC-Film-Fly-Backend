const db = require('../connection')
const { retrieveUser } = require('./user_models')

function retrieveRecs (id){
    return retrieveUser(id).then((response) => {
        return response
    })
    .then((response) => {

        











        return response
    })
}


module.exports = { retrieveRecs }

