const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

// User model
const User = require('../models/User') 

// login page
router.get('/login' , (req , res) => {
    res.render('login')
})

// register page
router.get('/register' , (req , res) => {
    res.render('register')
})

// register handle
router.post('/register' , async (req , res) => {
    const { name , email, password, password2 } = req.body
    let errors = []

    // Check for required fields
    if(!name || !email || !password || !password2){
        errors.push({ msg: 'Please fill in all fileds' })
    }

    // check for password matches
    if(password !== password2){
        errors.push({ msg: 'Password not matches!'})
    }

    if(errors.length > 0 ){
        res.render('register' , {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {

        const user = await User.findOne({ email: email })
        if(user){
            errors.push({ msg: 'User Exists!' })
            res.render('register' , {
                errors,
                name,
                email,
                password,
                password2
            })
    }
    else {
        const newUser = new User({
            name,
            email,
            password
        })

        try {
// First way to hash
            // bcrypt.genSalt(10 , (err,salt) => {
            //     bcrypt.hash(newUser.password , salt , (err , hash) => {
            //         if(err) throw err
            //         newUser.password = hash
            //         newUser.save().then(user => {
            //             res.redirect('/users/login')
            //         }).catch(err => res.send(err))
            //     })
            // })

// My way to hash
            newUser.password = await bcrypt.hash(newUser.password , 8)
            await newUser.save()
            req.flash('success_msg' , 'You are now registered!')
            res.redirect('/users/login')
        } catch(e) {
            console.log(e)
        }

    }

    }
    
})

router.post('/login' , (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

// logout handle
router.get('/logout' , (req, res) => {
    req.logOut()
    req.flash('success_msg' , 'You are logged out!')
    res.redirect('/users/login')
})

module.exports = router