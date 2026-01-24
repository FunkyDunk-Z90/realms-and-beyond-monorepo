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

// Public routes - no authentication required
router.post('/sign-up', signUpIdentity)
router.post('/login', loginIdentity)
router.post('/logout', logoutIdentity)
router.post('/forgot-password', forgotPassword)
router.patch('/reset-password/:token', resetPassword)
router.post('/recover-my-account', recoverIdentity)

// Protected route for checking login status (requires token but handled specially)
router.post('/is-logged-in', protectIdentity, isLoggedIn)

// All routes below require authentication
router.use(protectIdentity)

router.get('/my-account', getMyIdentity)
router.patch('/update-my-account', updateMyIdentity)
router.patch('/update-my-password', updatePassword)
router.delete('/delete-my-account', softDeleteIdentity)

export default router
