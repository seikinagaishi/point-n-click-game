const localStrategy = require('passport-local').Strategy
const bcrypt        = require('bcryptjs')
const mongoose      = require('mongoose')

require('../models/User')
const UserM = mongoose.model('tbuser')

module.exports = function(passport) {
    passport.use(new localStrategy({usernameField: 'username', passwordField: 'password'}, (name, password, done) => {
        UserM.findOne({name: name}).then((userFound) => {
            if(!userFound) {
                return done(null, false, {message: "User unexistent"})
            }

            bcrypt.compare(password, userFound.password, (erro, match) => {
                if(match) {
                    return done(null, userFound)
                } else {
                    return done(null, false, {message: "Invalid Password"})
                }
            })
        })
    }))

    passport.serializeUser((userON, done) => {
        done(null, userON.id)
    })

    passport.deserializeUser((id, done) => {
        UserM.findById(id, (err, userON) => {
            done(err, userON)
        })
    })
}