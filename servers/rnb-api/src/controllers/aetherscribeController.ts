import { RequestHandler } from 'express'
import cloudinary from '../config/cloudinary'
import { env } from '../utils/validateEnv'
import Identity from '../models/identityModel'
import AetherscribeAccount from '../models/aetherscribeModel'
import { createToken } from '../utils/jwtTokens'

const calculateDatesFromCycle = (cycle?: string) => {
    if (!cycle || cycle === 'never') {
        return {
            renewlCycle: 'never',
            expiresOn: null,
            renewsOn: null,
        }
    }

    const months = parseInt(cycle.split('-')[0], 10)

    if (isNaN(months)) {
        throw new Error('Invalid renewal cycle')
    }

    const now = new Date()
    const ms = months * 30 * 24 * 60 * 60 * 1000

    return {
        renewlCycle: cycle,
        expiresOn: new Date(now.getTime() + ms),
        renewsOn: new Date(now.getTime() + ms),
    }
}

// In identityAuthController.ts or a new combined controller

export const signUpWithAetherscribe: RequestHandler = async (
    req,
    res,
    next
) => {
    const {
        profile,
        contact,
        password,
        passwordConfirm,
        aetherscribe, // { username, avatar?, subscriptionTier?, renewlCycle? }
    } = req.body

    const { firstName, lastName, dateOfBirth, nationality } = profile
    const { email, phoneNumber, address } = contact

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !passwordConfirm) {
        return res.status(400).json({
            message:
                'Please provide: firstName, lastNames, email, password, and passwordConfirm',
        })
    }

    if (!aetherscribe?.username) {
        return res.status(400).json({
            message: 'Please provide an Aetherscribe username',
        })
    }

    try {
        // Check if username is already taken
        const existingAccount = await AetherscribeAccount.findOne({
            username: aetherscribe.username,
        })
        if (existingAccount) {
            return res.status(400).json({
                message: 'Username already taken',
            })
        }

        // Create new identity
        const newIdentity = await Identity.create({
            profile: {
                firstName,
                lastName,
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

        // Handle avatar
        let avatarURL = aetherscribe.avatar
        if (!avatarURL) {
            const result = await cloudinary.uploader.upload(
                env.USER_DEFAULT_AVATAR,
                {
                    public_id: `${aetherscribe.username}_${Date.now()}`,
                    folder: 'aetherscribe-avatars',
                }
            )
            avatarURL = result.secure_url
        }

        // Calculate subscription dates
        const cycleData = calculateDatesFromCycle(aetherscribe.renewlCycle)

        // Create Aetherscribe account
        const newAccount = await AetherscribeAccount.create({
            identityId: newIdentity.id,
            username: aetherscribe.username,
            avatar: avatarURL,
            content: {
                playerCharacters: [],
                worlds: [],
                campaigns: [],
                ancestries: [],
                classes: [],
                backgrounds: [],
                feats: [],
                items: [],
                monsters: [],
                spells: [],
            },
            subscription: {
                tier: aetherscribe.subscriptionTier || 'basic',
                status: 'active',
                startedOn: new Date(),
                expiresOn: cycleData.expiresOn,
                renewsOn: cycleData.renewsOn,
                renewlCycle: cycleData.renewlCycle,
                paymentMethods: [],
            },
        })

        // Link account to identity
        newIdentity.aetherscribeAccount = newAccount.id
        await newIdentity.save({ validateBeforeSave: false })

        // Create token
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
            aetherscribeAccount: newAccount.getPublicInfo(),
        })
    } catch (error) {
        console.error('Sign up with Aetherscribe error:', error)
        return res.status(500).json({
            message: 'Error creating account',
            error: error instanceof Error ? error.message : 'Unknown error',
        })
    }
}

export const createAetherscribeAccount: RequestHandler = async (
    req,
    res,
    next
) => {
    const { username, avatar, subscriptionTier, renewlCycle, paymentMethod } =
        req.body

    if (!username) {
        return res.status(400).json({
            message: 'username is required',
        })
    }

    try {
        const identity = await Identity.findById(req.user)

        if (!identity) {
            return res.status(404).json({ message: 'Identity not found' })
        }

        const existingAccount = await AetherscribeAccount.findOne({ username })
        if (existingAccount) {
            return res.status(400).json({
                message: 'username already taken',
            })
        }

        let avatarURL = avatar
        if (!avatarURL) {
            const result = await cloudinary.uploader.upload(
                env.USER_DEFAULT_AVATAR,
                {
                    public_id: `${username}_${Date.now()}`,
                    folder: 'aetherscribe-avatars',
                }
            )
            avatarURL = result.secure_url
        }

        const cycleData = calculateDatesFromCycle(renewlCycle)

        const newAccount = await AetherscribeAccount.create({
            identityId: identity.id,
            username,
            avatar: avatarURL,
            content: {
                playerCharacters: [],
                worlds: [],
                campaigns: [],
                ancestries: [],
                classes: [],
                backgrounds: [],
                feats: [],
                items: [],
                monsters: [],
                spells: [],
            },
            subscription: {
                tier: subscriptionTier || 'basic',
                status: 'active',
                startedOn: new Date(),
                expiresOn: cycleData.expiresOn,
                renewsOn: cycleData.renewsOn,
                renewlCycle: cycleData.renewlCycle,
                paymentMethods: [],
            },
        })

        identity.aetherscribeAccount = newAccount.id
        await identity.save({ validateBeforeSave: false })

        res.status(201).json({
            status: 'success',
            account: newAccount.getPublicInfo(),
        })
    } catch (error) {
        console.error('Create Aetherscribe account error:', error)
        return res.status(500).json({
            message: 'Error creating Aetherscribe account',
            error: error instanceof Error ? error.message : 'Unknown error',
        })
    }
}

export const getAetherscribeAccountById: RequestHandler = async (
    req,
    res,
    next
) => {
    const { accountId } = req.params

    try {
        const account = await AetherscribeAccount.findById(accountId)

        if (!account) {
            return res
                .status(404)
                .json({ message: 'Aetherscribe account not found' })
        }

        // Check if account belongs to requesting identity
        if (account.identityId.toString() !== req.user?.toString()) {
            return res.status(403).json({
                message: 'You do not have access to this account',
            })
        }

        res.status(200).json({
            status: 'success',
            account: account.getPublicInfo(),
        })
    } catch (error) {
        console.error('Get Aetherscribe account by ID error:', error)
        return res.status(500).json({
            message: 'Error retrieving Aetherscribe account',
        })
    }
}

export const updateAetherscribeAccount: RequestHandler = async (
    req,
    res,
    next
) => {
    const { accountId } = req.params
    const { username, avatar } = req.body

    try {
        const account = await AetherscribeAccount.findById(accountId)

        if (!account) {
            return res
                .status(404)
                .json({ message: 'Aetherscribe account not found' })
        }

        // Check ownership
        if (account.identityId.toString() !== req.user?.toString()) {
            return res.status(403).json({
                message: 'You do not have access to this account',
            })
        }

        // Check if new username is taken
        if (username && username !== account.username) {
            const existingAccount = await AetherscribeAccount.findOne({
                username,
            })
            if (existingAccount) {
                return res.status(400).json({
                    message: 'username already taken',
                })
            }
            account.username = username
        }

        // Update avatar if provided
        if (avatar) {
            const result = await cloudinary.uploader.upload(avatar, {
                public_id: `${account.username}_${Date.now()}`,
                folder: 'aetherscribe-avatars',
            })
            account.avatar = result.secure_url
        }

        await account.save()

        res.status(200).json({
            status: 'success',
            account: account.getPublicInfo(),
        })
    } catch (error) {
        console.error('Update Aetherscribeaccount error:', error)
        return res.status(500).json({
            message: 'Error updating Aetherscribe account',
        })
    }
}

export const updateAetherscribeSubscription: RequestHandler = async (
    req,
    res,
    next
) => {
    const { accountId } = req.params
    const { tier, renewlCycle, paymentMethod } = req.body

    try {
        const account = await AetherscribeAccount.findById(accountId)

        if (!account) {
            return res
                .status(404)
                .json({ message: 'Aetherscribe account not found' })
        }

        if (account.identityId.toString() !== req.user?.toString()) {
            return res.status(403).json({
                message: 'You do not have access to this account',
            })
        }

        if (!account.subscription) {
            return res.status(400).json({
                message: 'No subscription found for this account',
            })
        }

        // Update subscription details
        if (tier) account.subscription.tier = tier
        if (renewlCycle) account.subscription.renewlCycle = renewlCycle

        if (paymentMethod) {
            account.subscription.paymentMethods.push(paymentMethod)
        }

        // Recalculate expiry and renewal dates based on new cycle
        if (renewlCycle) {
            const cycleMonths = parseInt(renewlCycle.split('-')[0])
            const now = new Date()
            account.subscription.renewsOn = new Date(
                now.getTime() + cycleMonths * 30 * 24 * 60 * 60 * 1000
            )
            account.subscription.expiresOn = new Date(
                now.getTime() + cycleMonths * 30 * 24 * 60 * 60 * 1000
            )
        }

        await account.save()

        res.status(200).json({
            status: 'success',
            subscription: account.subscription,
        })
    } catch (error) {
        console.error('Update Aetherscribe subscription error:', error)
        return res.status(500).json({
            message: 'Error updating subscription',
        })
    }
}

export const deleteAetherscribeAccount: RequestHandler = async (
    req,
    res,
    next
) => {
    const { accountId } = req.params

    try {
        const account = await AetherscribeAccount.findById(accountId)

        if (!account) {
            return res
                .status(404)
                .json({ message: 'Aetherscribe account not found' })
        }

        if (account.identityId.toString() !== req.user?.toString()) {
            return res.status(403).json({
                message: 'You do not have access to this account',
            })
        }

        await Identity.findByIdAndUpdate(req.user, {
            $pull: { accounts: accountId },
        })

        await AetherscribeAccount.findByIdAndDelete(accountId)

        res.status(200).json({
            status: 'success',
            message: 'Aetherscribe account deleted successfully',
        })
    } catch (error) {
        console.error('Delete Aetherscribe account error:', error)
        return res.status(500).json({
            message: 'Error deleting Aetherscribe account',
        })
    }
}
