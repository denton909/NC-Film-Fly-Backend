const LocalStrategy = require("passport-local").Strategy;

const db = require('./db/connection')
const bcrypt = require("bcrypt")

function initialize (passport) {
    const authenticateUser = (email, password, done) => {
        db.query (`SELECT * FROM users WHERE email_address = $1`, [email]).then(({rows})=>{
            const user = rows[0]
            return user
        }).then((user)=> {
            return bcrypt
        })
    }

    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
        
    }, authenticateUser))
}



module.export = {initialize}