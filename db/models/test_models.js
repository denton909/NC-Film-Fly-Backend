const db = require('../connection')

function retrieveTest() {
  return db.query(`SELECT * FROM test_table WHERE genres ->> 0 = '{"name": "Comedy"}' OR genres ->> 1 = '{"name": "Comedy"}' ;`)
    .then(({rows}) => {
      console.log(rows)
      return rows
    })
}

module.exports = {retrieveTest}