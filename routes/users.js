const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const users = require('../controllers/users')

router.route('/register')
.get(users.renderRegister) //render register form
.post(catchAsync(users.register)) //register user

router.route('/login')
.get(users.renderLogin) //render login form
.post(//login user
    passport.authenticate('local', { 
        failureFlash: true, 
        failureRedirect: '/login' }), 
        users.login)

router.get('/logout', users.logout);

module.exports = router
