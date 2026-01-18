import { Schema } from 'mongoose'
import { I_ProductMembership } from '@rnb/types'

export const productMembershipSchema = new Schema<I_ProductMembership>(
    {
        product: {
            type: String,
            required: true,
            index: true,
        },
        tier: {
            type: String,
            enum: ['basic', 'premium', 'premium-plus', 'family', 'duo'],
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'paused', 'cancelled', 'expired'],
            required: true,
        },
        startedOn: {
            type: Date,
            required: true,
        },
        expiresOn: {
            type: Date,
            required: true,
        },
        renewsOn: {
            type: Date,
            required: true,
        },
        isRecurring: {
            type: Boolean,
            required: true,
        },
    },
    { _id: false }
)
