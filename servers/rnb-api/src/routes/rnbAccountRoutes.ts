import { Router } from 'express'
import { protectIdentity } from '../controllers/identityAuthController'
import {
    createRnBAccount,
    getMyRnBAccounts,
    getRnBAccountById,
    updateRnBAccount,
    updateRnBSubscription,
    deleteRnBAccount,
} from '../controllers/rnbAccountController'

const router = Router()

// All routes require authentication
router.use(protectIdentity)

// RnB Account Routes
router.post('/create', createRnBAccount)
router.get('/get', getMyRnBAccounts)
router.get('/my-account/:accountId', getRnBAccountById)
router.patch('/update/:accountId', updateRnBAccount)
router.patch('/subscription-update/:accountId', updateRnBSubscription)
router.delete('/delete/:accountId', deleteRnBAccount)

export default router
