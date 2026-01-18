import { Schema, model } from 'mongoose'
import { I_BillingAccount } from '@rnb/types'
import { paymentCardSchema } from './paymentCardModel'
import { paymentIbanSchema } from './paymentIbanModel'
import { overduePaymentSchema } from './overduePaymentModel'
import { productMembershipSchema } from './productMembershipModel'

const billingAccountSchema = new Schema<I_BillingAccount>(
    {
        identityId: {
            type: Schema.Types.ObjectId,
            ref: 'Identity',
            required: true,
            unique: true,
            index: true,
        },

        status: {
            type: String,
            enum: ['active', 'past-due', 'suspended', 'closed'],
            default: 'active',
        },

        memberships: {
            type: [productMembershipSchema],
            default: [],
        },

        paymentMethods: {
            cards: {
                type: [paymentCardSchema],
                default: [],
            },
            ibans: {
                type: [paymentIbanSchema],
                default: [],
            },
        },

        overduePayments: {
            type: [overduePaymentSchema],
            default: [],
        },
    },
    { timestamps: true }
)

export const BillingAccount = model<I_BillingAccount>(
    'BillingAccount',
    billingAccountSchema
)
