const db = require('../connection')
const {retrieveTest} = require('../models/test_models')

function getUserTest(req, res, next) {
  return retrieveTest().then(response => {
    res.status(200).send(response)
  })
}

module.exports = {getUserTest}
