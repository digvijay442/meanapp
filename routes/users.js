const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/database')

router.get('/', (req, res)=>{
    res.send('users')
})

router.post('/register', (req, res)=> {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    User.addUser(newUser, (err, user)=>{
        if(err){
            res.json({success: false, msg: 'Failed to register'})
        } else {
            res.json({success: true, msg: 'User registered'})
        }
    })
})

// Authenticate
router.post('/authenticate', (req, res)=> {
    // res.send('authenticate');
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        console.log('inside getUserByUsername')
        if(err) throw err;
        if(!user) {
            console.log('inside getUserByUsername - checking if(!user)')
            return res.json({success: false, msg: 'User not found'})
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            console.log('inside getUserByUsername - compare password')
            if(err) throw err;
            if(isMatch){
                console.log('inside getUserByUsername - if password isMatch')
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 604800  // 1 week
                });
                res.json({
                    success: true,
                    token: 'JWT '+ token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                console.log('inside getUserByUsername - else return wrong password')
                return res.json({ success: false, msg: 'Wrong Password'})
            }
        })
    })
})

router.get('/profile', passport.authenticate('jwt', {session : false}), (req, res)=> {
    // res.send('profile')
    res.json({user : req.user})
}) 


module.exports = router;

