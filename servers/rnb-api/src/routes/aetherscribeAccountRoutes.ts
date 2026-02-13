import { Router } from 'express'
import { protectIdentity } from '../controllers/identityAuthController'
import {
    createAetherscribeAccount,
    getAetherscribeAccountById,
    updateAetherscribeAccount,
    updateAetherscribeSubscription,
    deleteAetherscribeAccount,
    signUpWithAetherscribe,
} from '../controllers/aetherscribeController'

const router = Router()

router.post('/create', createAetherscribeAccount)
router.post('/signup', signUpWithAetherscribe)

router.use(protectIdentity)

router.get('/my-account/:accountId', getAetherscribeAccountById)
router.patch('/update/:accountId', updateAetherscribeAccount)
router.patch('/subscription-update/:accountId', updateAetherscribeSubscription)
router.delete('/delete/:accountId', deleteAetherscribeAccount)

export default router
