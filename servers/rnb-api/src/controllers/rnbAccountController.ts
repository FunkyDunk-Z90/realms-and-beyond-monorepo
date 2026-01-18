import { RequestHandler } from 'express'
import cloudinary from '../config/cloudinary'
import { env } from '../utils/validateEnv'
import Identity from '../models/identityModel'
import RnBAccount from '../models/rnbAccountModel'

// ---------- Helpers --------------

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

// ---------- Create RnB Account ----------
export const createRnBAccount: RequestHandler = async (req, res, next) => {
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

        // Check if username already exists
        const existingAccount = await RnBAccount.findOne({ username })
        if (existingAccount) {
            return res.status(400).json({
                message: 'username already taken',
            })
        }

        // Upload avatar if provided, otherwise use default
        let avatarURL = avatar
        if (!avatarURL) {
            const result = await cloudinary.uploader.upload(
                env.USER_DEFAULT_AVATAR,
                {
                    public_id: `${username}_${Date.now()}`,
                    folder: 'rnb-avatars',
                }
            )
            avatarURL = result.secure_url
        }

        const cycleData = calculateDatesFromCycle(renewlCycle)

        // Create RnB account
        const newAccount = await RnBAccount.create({
            identityId: identity.id,
            username,
            avatar: avatarURL,
            content: {
                playerCharacters: [],
                worlds: [],
                campaigns: [],
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

        // Add account to identity
        identity.accounts.push(newAccount.id)
        await identity.save({ validateBeforeSave: false })

        res.status(201).json({
            status: 'success',
            account: newAccount.getPublicInfo(),
        })
    } catch (error) {
        console.error('Create RnB account error:', error)
        return res.status(500).json({
            message: 'Error creating RnB account',
            error: error instanceof Error ? error.message : 'Unknown error',
        })
    }
}

// ---------- Get My RnB Accounts ----------
export const getMyRnBAccounts: RequestHandler = async (req, res, next) => {
    try {
        const accounts = await RnBAccount.find({ identityId: req.user })

        res.status(200).json({
            status: 'success',
            count: accounts.length,
            accounts: accounts.map((acc) => acc.getPublicInfo()),
        })
    } catch (error) {
        console.error('Get my RnB accounts error:', error)
        return res.status(500).json({
            message: 'Error retrieving RnB accounts',
        })
    }
}

// ---------- Get RnB Account By ID ----------
export const getRnBAccountById: RequestHandler = async (req, res, next) => {
    const { accountId } = req.params

    try {
        const account = await RnBAccount.findById(accountId)

        if (!account) {
            return res.status(404).json({ message: 'RnB account not found' })
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
        console.error('Get RnB account by ID error:', error)
        return res.status(500).json({
            message: 'Error retrieving RnB account',
        })
    }
}

// ---------- Update RnB Account ----------
export const updateRnBAccount: RequestHandler = async (req, res, next) => {
    const { accountId } = req.params
    const { username, avatar } = req.body

    try {
        const account = await RnBAccount.findById(accountId)

        if (!account) {
            return res.status(404).json({ message: 'RnB account not found' })
        }

        // Check ownership
        if (account.identityId.toString() !== req.user?.toString()) {
            return res.status(403).json({
                message: 'You do not have access to this account',
            })
        }

        // Check if new username is taken
        if (username && username !== account.username) {
            const existingAccount = await RnBAccount.findOne({ username })
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
                folder: 'rnb-avatars',
            })
            account.avatar = result.secure_url
        }

        await account.save()

        res.status(200).json({
            status: 'success',
            account: account.getPublicInfo(),
        })
    } catch (error) {
        console.error('Update RnB account error:', error)
        return res.status(500).json({
            message: 'Error updating RnB account',
        })
    }
}

// ---------- Update RnB Subscription ----------
export const updateRnBSubscription: RequestHandler = async (req, res, next) => {
    const { accountId } = req.params
    const { tier, renewlCycle, paymentMethod } = req.body

    try {
        const account = await RnBAccount.findById(accountId)

        if (!account) {
            return res.status(404).json({ message: 'RnB account not found' })
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
        console.error('Update RnB subscription error:', error)
        return res.status(500).json({
            message: 'Error updating subscription',
        })
    }
}

// ---------- Delete RnB Account ----------
export const deleteRnBAccount: RequestHandler = async (req, res, next) => {
    const { accountId } = req.params

    try {
        const account = await RnBAccount.findById(accountId)

        if (!account) {
            return res.status(404).json({ message: 'RnB account not found' })
        }

        if (account.identityId.toString() !== req.user?.toString()) {
            return res.status(403).json({
                message: 'You do not have access to this account',
            })
        }

        // Remove account reference from identity
        await Identity.findByIdAndUpdate(req.user, {
            $pull: { accounts: accountId },
        })

        // Delete the account
        await RnBAccount.findByIdAndDelete(accountId)

        res.status(200).json({
            status: 'success',
            message: 'RnB account deleted successfully',
        })
    } catch (error) {
        console.error('Delete RnB account error:', error)
        return res.status(500).json({
            message: 'Error deleting RnB account',
        })
    }
}
