const { json } = require('express')
const db = require('../connection')
const endpoints = require('../endpoints.json')


function getEndpoints (req, res, next) {
    res.status(200).send(endpoints)
        
}

module.exports = getEndpoints