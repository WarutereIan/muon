import { Router } from "express";
import adminAuth from "../auth/adminAuth.js";
// import { URLToken } from "../functions/generateURLToken.js";
import makeAnnouncement from '../functions/makeAnnouncement.js'
import { RatesModifier } from '../functions/changeRates.js'

const adminRoutes = new Router()

adminRoutes.post(`/admin/api/login`,adminAuth.login)

adminRoutes.post(`/admin/admin/signup`,adminAuth.signup)

adminRoutes.post(`/admin/api/:uid/changeRate`,adminAuth.sessionAuth,RatesModifier)

adminRoutes.post(`/admin/api/:uid/makeAnnouncement`,adminAuth.sessionAuth,makeAnnouncement)

export default adminRoutes