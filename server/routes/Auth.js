const express = require('express')
const router = express.Router()
const authcontroller = require('../controllers/Auth')

router
    .post('/signup', authcontroller.signup)
    .post('/login', authcontroller.login)
    .post('/forget', authcontroller.forget)
    .post('/reset', authcontroller.reset)


module.exports = router