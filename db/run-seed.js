const seed = require('./seed');
const db = require('./connection.js');
const runSeed = () => {
  return seed().then(() => db.end());
};
runSeed();