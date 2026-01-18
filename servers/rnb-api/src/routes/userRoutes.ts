import { Router } from 'express'
import {
    signUp,
    login,
    protect,
    forgotPassword,
    resetPassword,
    updatePassword,
    logout,
    getMyAccount,
    updateMyAccount,
    deleteMyAccount,
    isLoggedIn,
} from '../controllers/authController'

const router = Router()

router.post('/sign-up', signUp)
router.post('/login', login)
router.post('/logout', logout)

router.post('/forgot-password', forgotPassword)
router.patch('/reset-password/:token', resetPassword)

router.use('/', protect)
router.post('/is-logged-in', isLoggedIn)

router.get('/my-account', getMyAccount)
router.patch('/update-my-account', updateMyAccount)
router.patch('/update-my-password', updatePassword)
router.delete('/delete-my-account', deleteMyAccount)

export default router
