import { Router } from "express";
import adminAuth from "../auth/adminAuth.js";
// import { URLToken } from "../functions/generateURLToken.js";
import makeAnnouncement from '../functions/makeAnnouncement.js'
import { RatesModifier } from '../functions/changeRates.js'

const adminRoutes = new Router()

adminRoutes.post(`/api/admin/login`,adminAuth.login)

adminRoutes.post(`/api/admin/signup`,adminAuth.signup)

adminRoutes.post(`/api/admin/:uid/changeRate`,adminAuth.sessionAuth,RatesModifier)

adminRoutes.post(`/api/admin/:uid/makeAnnouncement`,adminAuth.sessionAuth,makeAnnouncement)

export default adminRoutes