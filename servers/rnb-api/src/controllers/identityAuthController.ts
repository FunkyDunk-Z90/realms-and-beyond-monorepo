import { RequestHandler } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { createHash } from 'crypto'
import { env } from '../utils/validateEnv'
import { createToken, extractToken } from '../utils/jwtTokens'
import Identity from '../models/identityModel'

// ---------- Sign Up (Create Identity) ----------
export const signUpIdentity: RequestHandler = async (req, res, next) => {
    const { profile, contact, password, passwordConfirm } = req.body

    const { firstName, lastNames, dateOfBirth, nationality } = profile
    const { email, phoneNumber, address } = contact

    // Validate required fields
    if (!firstName || !lastNames || !email || !password || !passwordConfirm) {
        return res.status(400).json({
            message:
                'Please provide: firstName, lastNames, email, password, and passwordConfirm',
        })
    }

    // Validate lastNames is an array
    if (!Array.isArray(lastNames) || lastNames.length === 0) {
        return res.status(400).json({
            message: 'lastNames must be a non-empty array',
        })
    }

    try {
        // Create new identity
        const newIdentity = await Identity.create({
            profile: {
                firstName,
                lastNames,
                dateOfBirth,
                nationality,
            },
            contact: {
                email,
                phoneNumber,
                address: address || {},
            },
            lifecycle: {
                status: 'active',
            },
            password,
            passwordConfirm,
        })

        const accessToken = createToken(newIdentity.id)

        res.cookie('jwt', accessToken, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        })

        res.status(201).json({
            status: 'success',
            accessToken,
            identity: newIdentity.getPublicInfo(),
        })
    } catch (error) {
        console.error('Sign up identity error:', error)
        return res.status(500).json({
            message: 'Error creating identity',
            error: error instanceof Error ? error.message : 'Unknown error',
        })
    }
}

// ---------- Login ----------
export const loginIdentity: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body

    try {
        if (!email || !password) {
            return res.status(400).json({
                message: 'Please provide email and password',
            })
        }

        // Find identity by email
        const identity = await Identity.findOne({
            'contact.email': email,
        }).select('+password')

        if (!identity) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Check if identity is active
        if (identity.lifecycle.status !== 'active') {
            return res.status(401).json({
                message: 'Account is not active',
            })
        }

        // Verify password
        const isPasswordValid = await identity.correctPassword(
            password,
            identity.password
        )

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Update last login timestamp
        identity.lastLoginAt = new Date()
        await identity.save({ validateBeforeSave: false })

        const accessToken = createToken(identity.id)

        res.cookie('jwt', accessToken, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        })

        res.status(200).json({
            status: 'success',
            accessToken,
            identity: identity.getPublicInfo(),
        })
    } catch (error) {
        console.error('Login error:', error)
        return res.status(500).json({ message: 'Login error' })
    }
}

// ---------- Logout ----------
export const logoutIdentity: RequestHandler = (req, res, next) => {
    res.clearCookie('jwt')
    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
    })
}

// ---------- Protect Middleware ----------
export const protectIdentity: RequestHandler = async (req, res, next) => {
    try {
        const token = extractToken(req)

        if (!token) {
            return res
                .status(401)
                .json({ message: 'Unauthorized - No token provided' })
        }

        const { iat, _id } = jwt.verify(token, env.JWT_SECRET) as JwtPayload

        if (!iat) {
            return res.status(401).json({ message: 'Invalid token' })
        }

        const decodedDate = new Date(iat * 1000)
        const identity = await Identity.findById(_id)

        if (!identity) {
            return res.status(401).json({ message: 'Identity not found' })
        }

        if (identity.lifecycle.status !== 'active') {
            return res.status(401).json({ message: 'Account is not active' })
        }

        if (identity.changedPasswordAfter(decodedDate)) {
            return res.status(401).json({
                message: 'Password recently changed, please login again',
            })
        }

        req.user = identity.id
        next()
    } catch (error) {
        console.error('Protect middleware error:', error)
        return res.status(401).json({ message: 'Unauthorized' })
    }
}

// ---------- Check Login Status ----------
export const isLoggedIn: RequestHandler = async (req, res, next) => {
    try {
        const identity = await Identity.findById(req.user).populate('accounts')

        if (!identity) {
            return res.status(400).json({ message: 'Please login again' })
        }

        return res.status(200).json({
            status: 'success',
            identity: identity.getPublicInfo(),
        })
    } catch (error) {
        console.error('Is logged in error:', error)
        return res.status(500).json({ message: 'Error checking login status' })
    }
}

// ---------- Forgot Password ----------
export const forgotPassword: RequestHandler = async (req, res, next) => {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({ message: 'Please provide email' })
    }

    try {
        const identity = await Identity.findOne({ 'contact.email': email })

        if (!identity) {
            return res
                .status(404)
                .json({ message: 'No identity found with that email' })
        }

        const resetToken = identity.createPasswordResetToken()
        await identity.save({ validateBeforeSave: false })

        const resetURL = `${req.protocol}://${req.get(
            'host'
        )}/api/v1/identity/reset-password/${resetToken}`

        const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`

        res.status(200).json({
            status: 'success',
            message: message,
            resetToken, // Remove in production, only for testing
        })
    } catch (error) {
        console.error('Forgot password error:', error)
        return res.status(500).json({
            message: 'Error processing password reset',
        })
    }
}

// ---------- Reset Password ----------
export const resetPassword: RequestHandler = async (req, res, next) => {
    const { password, passwordConfirm } = req.body

    if (!password || !passwordConfirm) {
        return res.status(400).json({
            message: 'Please provide password and passwordConfirm',
        })
    }

    try {
        const hashedToken = createHash('sha256')
            .update(req.params.token)
            .digest('hex')

        const identity = await Identity.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpiresIn: { $gt: Date.now() },
        })

        if (!identity) {
            return res.status(401).json({
                message: 'Token is invalid or has expired',
            })
        }

        identity.password = password
        identity.passwordConfirm = passwordConfirm
        identity.passwordResetToken = undefined
        identity.passwordResetExpiresIn = undefined

        await identity.save()

        const accessToken = createToken(identity.id)

        res.cookie('jwt', accessToken, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        })

        res.status(200).json({
            status: 'success',
            accessToken,
            identity: identity.getPublicInfo(),
        })
    } catch (error) {
        console.error('Reset password error:', error)
        return res.status(500).json({ message: 'Error resetting password' })
    }
}

// ---------- Update Password ----------
export const updatePassword: RequestHandler = async (req, res, next) => {
    const { currentPassword, password, passwordConfirm } = req.body

    if (!currentPassword || !password || !passwordConfirm) {
        return res.status(400).json({
            message:
                'Please provide currentPassword, password, and passwordConfirm',
        })
    }

    try {
        const identity = await Identity.findById(req.user).select('+password')

        if (!identity || !identity.password) {
            return res.status(404).json({ message: 'Identity not found' })
        }

        const isCurrentPasswordValid = await identity.correctPassword(
            currentPassword,
            identity.password
        )

        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                message: 'Current password is incorrect',
            })
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({ message: 'Passwords do not match' })
        }

        identity.password = password
        identity.passwordConfirm = passwordConfirm
        await identity.save()

        const accessToken = createToken(identity.id)

        res.cookie('jwt', accessToken, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        })

        res.status(200).json({
            status: 'success',
            accessToken,
            identity: identity.getPublicInfo(),
        })
    } catch (error) {
        console.error('Update password error:', error)
        return res.status(500).json({ message: 'Error updating password' })
    }
}

// ---------- Get My Identity ----------
export const getMyIdentity: RequestHandler = async (req, res, next) => {
    try {
        const identity = await Identity.findById(req.user).populate('accounts')

        if (!identity) {
            return res.status(404).json({ message: 'Identity not found' })
        }

        res.status(200).json({
            status: 'success',
            identity: identity.getPublicInfo(),
        })
    } catch (error) {
        console.error('Get my identity error:', error)
        return res.status(500).json({ message: 'Error retrieving identity' })
    }
}

// ---------- Update My Identity ----------
export const updateMyIdentity: RequestHandler = async (req, res, next) => {
    try {
        const { body } = req

        if (body.password || body.passwordConfirm) {
            return res.status(400).json({
                message:
                    'Please use the update password endpoint to change password',
            })
        }

        // Build update object for nested structure
        const updateData: any = {}

        if (body.firstName) updateData['profile.firstName'] = body.firstName
        if (body.lastNames) updateData['profile.lastNames'] = body.lastNames
        if (body.dateOfBirth)
            updateData['profile.dateOfBirth'] = body.dateOfBirth
        if (body.nationality)
            updateData['profile.nationality'] = body.nationality
        if (body.email) updateData['contact.email'] = body.email
        if (body.phoneNumber)
            updateData['contact.phoneNumber'] = body.phoneNumber
        if (body.address) updateData['contact.address'] = body.address

        const updatedIdentity = await Identity.findByIdAndUpdate(
            req.user,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        ).populate('accounts')

        if (!updatedIdentity) {
            return res.status(404).json({ message: 'Identity not found' })
        }

        res.status(200).json({
            status: 'success',
            identity: updatedIdentity.getPublicInfo(),
        })
    } catch (error) {
        console.error('Update my identity error:', error)
        return res.status(500).json({ message: 'Error updating identity' })
    }
}

// ---------- Soft Delete Identity ----------
export const softDeleteIdentity: RequestHandler = async (req, res, next) => {
    try {
        const identity = await Identity.findById(req.user)

        if (!identity) {
            return res.status(404).json({ message: 'Identity not found' })
        }

        const deletedAt = new Date()
        const recoverableUntil = new Date(
            deletedAt.getTime() + 30 * 24 * 60 * 60 * 1000
        ) // 30 days

        identity.lifecycle.status = 'soft-deleted'
        identity.lifecycle.deletedAt = deletedAt
        identity.lifecycle.recoverableUntil = recoverableUntil

        await identity.save({ validateBeforeSave: false })

        res.clearCookie('jwt')

        res.status(200).json({
            status: 'success',
            message: 'Identity soft deleted. Can be recovered within 30 days.',
            recoverableUntil,
        })
    } catch (error) {
        console.error('Soft delete identity error:', error)
        return res.status(500).json({ message: 'Error deleting identity' })
    }
}

// ---------- Recover Identity ----------
export const recoverIdentity: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            message: 'Please provide email and password',
        })
    }

    try {
        const identity = await Identity.findOne({
            'contact.email': email,
            'lifecycle.status': 'soft-deleted',
            'lifecycle.recoverableUntil': { $gt: Date.now() },
        }).select('+password')

        if (!identity) {
            return res.status(404).json({
                message:
                    'No recoverable identity found or recovery period expired',
            })
        }

        const isPasswordValid = await identity.correctPassword(
            password,
            identity.password
        )

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        identity.lifecycle.status = 'active'
        identity.lifecycle.deletedAt = undefined
        identity.lifecycle.recoverableUntil = undefined

        await identity.save({ validateBeforeSave: false })

        const accessToken = createToken(identity.id)

        res.cookie('jwt', accessToken, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        })

        res.status(200).json({
            status: 'success',
            message: 'Identity recovered successfully',
            accessToken,
            identity: identity.getPublicInfo(),
        })
    } catch (error) {
        console.error('Recover identity error:', error)
        return res.status(500).json({ message: 'Error recovering identity' })
    }
}
