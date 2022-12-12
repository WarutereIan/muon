const express = require('express')
const auth = require('../controllers/auth')
const functions = require('../controllers/functions')

const router = express.Router()

router.post('/api/login', auth.login)

router.post('/api/signup', auth.signup)

router.get('/api/:uid/viewbalance', auth.sessionAuth,functions.viewBalance)

router.get('/api/:uid/inviteuser',auth.sessionAuth,functions.inviteUser)

module.exports = router