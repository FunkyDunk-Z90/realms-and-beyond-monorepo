import { Schema, model, Document } from 'mongoose'
import { I_RnBAccount } from '@rnb/types'
import { formatDate } from '../utils/formateDate'

interface I_RnBAccountDocument extends Omit<I_RnBAccount, 'id'>, Document {
    getPublicInfo(): Partial<I_RnBAccount>
}

const rnbAccountSchema = new Schema<I_RnBAccountDocument>(
    {
        identityId: {
            type: Schema.Types.ObjectId,
            ref: 'Identity',
            required: [true, 'Identity ID is required'],
            index: true,
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },
        avatar: {
            type: String,
        },
        content: {
            playerCharacters: [
                {
                    contentId: {
                        type: Schema.Types.ObjectId,
                        ref: 'PlayerCharacter',
                    },
                    contentName: {
                        type: String,
                    },
                },
            ],
            worlds: [
                {
                    contentId: {
                        type: Schema.Types.ObjectId,
                        ref: 'World',
                    },
                    contentName: {
                        type: String,
                    },
                },
            ],
            campaigns: [
                {
                    contentId: {
                        type: Schema.Types.ObjectId,
                        ref: 'Campaign',
                    },
                    contentName: {
                        type: String,
                    },
                },
            ],
        },
        subscription: {
            tier: {
                type: String,
                enum: ['basic', 'premium', 'premium-plus', 'family', 'duo'],
                default: 'basic',
            },
            status: {
                type: String,
                enum: ['active', 'paused', 'cancelled', 'expired'],
                default: 'active',
            },
            startedOn: {
                type: Date,
                default: Date.now,
            },
            expiresOn: Date,
            renewsOn: Date,
            renewlCycle: {
                type: String,
                enum: [
                    'never',
                    '1-month',
                    '3-months',
                    '6-months',
                    '12-months',
                    '18-months',
                    '24-months',
                ],
                default: '1-month',
            },
            linkedUsers: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Identity',
                },
            ],
            overduePayments: [
                {
                    amount: Number,
                    dueDate: Date,
                    invoiceId: String,
                },
            ],
            paymentMethods: [
                {
                    type: {
                        type: String,
                        enum: [
                            'credit_card',
                            'debit_card',
                            'paypal',
                            'bank_transfer',
                        ],
                    },
                    isDefault: Boolean,
                    last4: String,
                    expiryDate: String,
                },
            ],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

// Indexes
// rnbAccountSchema.index({ identityId: 1 })
// rnbAccountSchema.index({ userName: 1 })

// Instance methods
rnbAccountSchema.methods.getPublicInfo = function (): Partial<I_RnBAccount> {
    return {
        identityId: this.identityId,
        username: this.username,
        avatar: this.avatar,
        content: this.content,
        subscription: this.subscription
            ? {
                  ...this.subscription.toObject(),
                  startedOn: formatDate(this.subscription.startedOn),
                  expiresOn: formatDate(this.subscription.expiresOn),
                  renewsOn: formatDate(this.subscription.renewsOn),
              }
            : null,
        createdAt: formatDate(this.createdAt),
        updatedAt: formatDate(this.updatedAt),
    }
}

const RnBAccount = model<I_RnBAccountDocument>('RnBAccount', rnbAccountSchema)

export default RnBAccount
