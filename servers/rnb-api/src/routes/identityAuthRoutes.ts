import { Router } from 'express'
import {
    signUpIdentity,
    protectIdentity,
    loginIdentity,
    isLoggedIn,
    getMyIdentity,
    logoutIdentity,
    forgotPassword,
    recoverIdentity,
    resetPassword,
    softDeleteIdentity,
    updateMyIdentity,
    updatePassword,
} from '../controllers/identityAuthController'

const router = Router()

router.post('/sign-up', signUpIdentity)
router.post('/login', loginIdentity)
router.post('/logout', logoutIdentity)

router.post('/forgot-password', forgotPassword)
router.patch('/reset-password/:token', resetPassword)

router.use('/', protectIdentity)
router.post('/is-logged-in', isLoggedIn)

router.get('/my-account', getMyIdentity)
router.patch('/update-my-account', updateMyIdentity)
router.patch('/update-my-password', updatePassword)
router.patch('/recover-my-account', recoverIdentity)
router.delete('/delete-my-account', softDeleteIdentity)

export default router
