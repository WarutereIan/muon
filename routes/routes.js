import { Router } from 'express'
import auth from '../controllers/auth.js'
import functions from '../controllers/functions.js'
import services  from '../services/services.js'
import { URLToken } from '../admin/generateURLToken.js'
import adminAuth from '../admin/auth/adminAuth.js'

const router = Router()



router.post('/api/login', auth.login)

router.post('/api/signup', auth.signup)

router.post('/api/:uid/changePassword',auth.sessionAuth,auth.resetPassword)

router.get('/api/:uid/viewbalance', auth.sessionAuth, functions.viewBalance)

router.get('/api/:uid/inviteuser',auth.sessionAuth, functions.inviteUser)

router.get('/api/:uid/startMiningSession',auth.sessionAuth, functions.startMiningSession)

router.get('/api/:uid/getEmailOTP/',auth.sessionAuth,services.sendOTP)

router.post('/api/:uid/verifyEmailOTP',auth.sessionAuth,services.verifyOTP)

router.get('/api/signup/:uid/first-time-verification/:token',services.emailLinkVerification)

router.post(`/api/admin/${URLToken}/login`,adminAuth.login)

router.post(`/api/admin/${URLToken}/signup`,adminAuth.signup)

router.put(`/api/admin/${URLToken}/changeRate`,adminAuth.sessionAuth)

router.put(`/api/admin/${URLToken}/makeAnnouncement`,adminAuth.sessionAuth,)



export default router