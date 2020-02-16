const LocalStratgy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const User = require('../models/User')


module.exports = function(passport) {
    passport.use(
        new LocalStratgy({ usernameField: 'email' } , async (email, password, done) => {
            
            try {
            const user = await User.findOne({email: email})
            
            if(!user) 
                return done(null, false, { message: 'That email is not registered!' })
            
            bcrypt.compare(password, user.password , (err, isMatch) => {
                if(err) throw err

                if(isMatch){
                    return done(null, user)
                } else {
                    return done(null, false, { message: 'Password is incorrect!' })
                }
            })
        } catch (e) {console.log(e)}

        })
        
    )
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });
}
