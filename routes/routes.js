import { Router } from 'express'
import auth from '../controllers/auth.js'
import functions from '../controllers/functions.js'
import services  from '../services/services.js'

const router = Router()

router.post('/api/login', auth.login)

router.post('/api/signup', auth.signup)

router.get('/api/:uid/viewbalance', auth.sessionAuth, functions.viewBalance)

router.get('/api/:uid/inviteuser',auth.sessionAuth, functions.inviteUser)

router.get('/api/:uid/getEmailOTP/',auth.sessionAuth,services.sendOTP)

router.post('/api/:uid/verifyEmailOTP',auth.sessionAuth,services.verifyOTP)



export default router