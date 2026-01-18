import { Request, RequestHandler } from 'express'
import { env } from '../utils/validateEnv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { createHash } from 'crypto'
import { Types } from 'mongoose'
import cloudinary from '../config/cloudinary'
import { I_Identity } from '@rnb/types'

// Models
import User from '../models/userCoreModel'
import Identity from '../models/identityModel'

// Utils
import { createToken, extractToken } from '../utils/jwtTokens'
import { copyObj } from '../utils/copyObject'

// ----------Sign Up----------

const signUp: RequestHandler = async (req, res, next) => {
    const {
        firstName,
        lastNames,
        dateOfBirth,
        nationality,
        email,
        contact,
        password,
        passwordConfirm,
    } = req.body

    // Validate required fields
    if (
        !firstName ||
        !lastNames ||
        !dateOfBirth ||
        !email ||
        !contact ||
        !password ||
        !passwordConfirm
    ) {
        return res.status(400).json({
            message: 'Please provide all requested information',
        })
    }

    // Validate lastNames is an array
    if (!Array.isArray(lastNames) || lastNames.length === 0) {
        return res.status(400).json({
            message: 'lastNames must be a non-empty array',
        })
    }

    try {
        // Create new user with nested basicInfo structure
        const newUser = await Identity.create({
            firstName,
            lastNames,
            dateOfBirth,
            nationality,
            contact,
            password,
            passwordConfirm,
        })

        const accessToken = createToken(newUser.id)

        res.cookie('jwt', accessToken, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        })

        res.status(201).json({
            status: 'success',
            accessToken,
            user: newUser.getUserInfo(),
        })
    } catch (error) {
        console.log('Sign up error:', error)
        return res.status(500).json({
            message: 'Error creating user',
            error: error instanceof Error ? error.message : 'Unknown error',
        })
    }
}

// ---------- Login ----------

const login: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body

    try {
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: 'Please provide email and password' })
        }

        // Query by nested email path
        const user = await User.findOne({
            'basicInfo.contact.email': email,
        }).select('+password')

        if (!user) {
            return res.status(401).json({ message: 'User not found' })
        }

        if (password && user.password) {
            const isPasswordValid = await user.correctPassword(
                password,
                user.password
            )

            if (!isPasswordValid) {
                return res
                    .status(401)
                    .json({ message: 'Could not log in, please try again' })
            }
        } else {
            return res
                .status(401)
                .json({ message: 'Could not log in, please try again' })
        }

        // Update last login timestamp
        user.basicInfo.lastLoginAt = new Date()
        await user.save({ validateBeforeSave: false })

        const accessToken = createToken(user.id)

        res.cookie('jwt', accessToken, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        })

        res.status(200).json({
            status: 'success',
            accessToken,
            user: user.getUserInfo(),
        })
    } catch (error) {
        console.log('Error during user retrieval:', error)
        return res.status(500).json({ message: 'Login error' })
    }
}

//----------Logout----------

const logout: RequestHandler = (req, res, next) => {
    res.clearCookie('jwt')
    res.status(200).json({ message: 'Logged out' })
}

//----------Protect----------

const protect: RequestHandler = async (req, res, next) => {
    try {
        const token = extractToken(req)

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { iat, _id } = jwt.verify(token, env.JWT_SECRET) as JwtPayload

        if (!iat) {
            return res.status(401).json({ message: 'Please login again' })
        }

        const decodedDate = new Date(iat * 1000)
        const user = await User.findById(_id)

        if (!user) {
            return res.status(401).json({ message: 'User not found' })
        }

        if (user.changedPasswordAfter(decodedDate)) {
            return res.status(401).json({ message: 'Please login again' })
        }

        req.user = user.id

        next()
    } catch (error) {
        console.log('Protect middleware error:', error)
        return res.status(401).json({ message: 'Unauthorized' })
    }
}

//----------Is Logged In----------

const isLoggedIn: RequestHandler = async (req, res, next) => {
    try {
        const user = await User.findById(req.user)

        if (!user) {
            return res.status(400).json({ message: 'Please login again' })
        }

        return res.status(200).json({
            status: 'success',
            user: user.getUserInfo(),
        })
    } catch (error) {
        console.log('Is logged in error:', error)
        return res.status(500).json({ message: 'Error checking login status' })
    }
}

//----------Forgot Password-----------

const forgotPassword: RequestHandler = async (req, res, next) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ 'basicInfo.contact.email': email })

        if (!user) {
            return res.status(401).json({ message: 'User not found' })
        }

        const resetToken = user.createPasswordResetToken()
        await user.save({ validateBeforeSave: false })

        const resetURL = `${req.protocol}://${req.get(
            'host'
        )}/api/v2/users/reset-password/${resetToken}`

        const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`

        res.status(200).json({
            status: 'success',
            message: message,
        })
    } catch (error) {
        console.log('Forgot password error:', error)
        return res
            .status(500)
            .json({ message: 'Error processing password reset' })
    }
}

//----------Reset Password----------

const resetPassword: RequestHandler = async (req, res, next) => {
    const { password, passwordConfirm } = req.body

    try {
        const hashedToken = createHash('sha256')
            .update(req.params.token)
            .digest('hex')

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpiresIn: { $gt: Date.now() },
        })

        if (!user) {
            return res
                .status(401)
                .json({ message: 'Token is invalid or has expired' })
        }

        user.password = password
        user.passwordConfirm = passwordConfirm
        user.passwordResetToken = undefined
        user.passwordResetExpiresIn = undefined

        await user.save()

        const accessToken = createToken(user.id)

        res.cookie('jwt', accessToken, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        })

        res.status(200).json({
            status: 'success',
            accessToken,
            user: user.getUserInfo(),
        })
    } catch (error) {
        console.log('Reset password error:', error)
        return res.status(500).json({ message: 'Error resetting password' })
    }
}

//----------Update Password----------

const updatePassword: RequestHandler = async (req, res, next) => {
    const { currentPassword, password, passwordConfirm } = req.body

    try {
        const user = await User.findById(req?.user).select('+password')

        if (!user || !user.password) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (!(await user.correctPassword(currentPassword, user.password))) {
            return res
                .status(401)
                .json({ message: 'Current password is invalid' })
        }

        if (password !== passwordConfirm) {
            return res.status(401).json({ message: 'Passwords do not match' })
        }

        user.password = password
        user.passwordConfirm = passwordConfirm
        await user.save()

        const accessToken = createToken(user.id)

        res.cookie('jwt', accessToken, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        })

        res.status(200).json({
            status: 'success',
            accessToken,
            user: user.getUserInfo(),
        })
    } catch (error) {
        console.log('Update password error:', error)
        return res.status(500).json({ message: 'Error updating password' })
    }
}

//----------Get My Account----------

const getMyAccount: RequestHandler = async (req, res, next) => {
    try {
        const user = await User.findById(req?.user)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({
            status: 'success',
            user: user.getUserInfo(),
        })
    } catch (error) {
        console.log('Get my account error:', error)
        return res.status(500).json({ message: 'Error retrieving account' })
    }
}

//----------Update My Account----------

const updateMyAccount: RequestHandler = async (req, res, next) => {
    try {
        const { body } = req

        if (body.password || body.passwordConfirm) {
            return res
                .status(400)
                .json({ message: 'Please use "Update My Password" endpoint' })
        }

        // Build update object for nested basicInfo structure
        const updateData: any = {}

        if (body.firstName) updateData['basicInfo.firstName'] = body.firstName
        if (body.lastNames) updateData['basicInfo.lastNames'] = body.lastNames
        if (body.placeOfBirth)
            updateData['basicInfo.placeOfBirth'] = body.placeOfBirth
        if (body.nationality)
            updateData['basicInfo.nationality'] = body.nationality
        if (body.email) updateData['basicInfo.contact.email'] = body.email
        if (body.phoneNumber)
            updateData['basicInfo.contact.phoneNumber'] = body.phoneNumber
        if (body.address) updateData['basicInfo.contact.address'] = body.address

        // Handle avatar upload if provided
        if (body.avatarURL) {
            const user = await User.findById(req.user)
            const result = await cloudinary.uploader.upload(body.avatarURL, {
                public_id:
                    user?.basicInfo.contact.email.split('@')[0] || 'user',
                folder: 'user-avatars',
            })
            // Store avatar in appropriate service account if needed
            // For now, you might want to add an avatar field to basicInfo
        }

        const updatedUser = await User.findByIdAndUpdate(
            req?.user,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        )

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({
            status: 'success',
            user: updatedUser.getUserInfo(),
        })
    } catch (error) {
        console.log('Update my account error:', error)
        return res.status(500).json({ message: 'Error updating account' })
    }
}

//----------Delete My Account----------

const deleteMyAccount: RequestHandler = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req?.user, {
            'basicInfo.userStatus': 'inactive',
        })

        res.status(200).json({
            status: 'success',
            message: 'Account deactivated',
        })
    } catch (error) {
        console.log('Delete my account error:', error)
        return res.status(500).json({ message: 'Error deactivating account' })
    }
}

export {
    signUp,
    login,
    logout,
    protect,
    forgotPassword,
    resetPassword,
    updatePassword,
    getMyAccount,
    updateMyAccount,
    deleteMyAccount,
    isLoggedIn,
}
