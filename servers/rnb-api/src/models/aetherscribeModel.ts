import { Schema, model, Document } from 'mongoose'
import { I_AetherScribeAccountProps } from '@rnb/types'
import { formatDate } from '../utils/formateDate'

interface I_AetherScribeAccountDocument
    extends Omit<I_AetherScribeAccountProps, 'id'>, Document {
    getPublicInfo(): Partial<I_AetherScribeAccountProps>
}

const aetherscribeSchema = new Schema<I_AetherScribeAccountDocument>(
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
            items: [
                {
                    contentId: {
                        type: Schema.Types.ObjectId,
                        ref: 'Item',
                    },
                    contentName: {
                        type: String,
                    },
                },
            ],
            classes: [
                {
                    contentId: {
                        type: Schema.Types.ObjectId,
                        ref: 'TtrpgClass',
                    },
                    contentName: {
                        type: String,
                    },
                },
            ],
            ancestries: [
                {
                    contentId: {
                        type: Schema.Types.ObjectId,
                        ref: 'Ancestry',
                    },
                    contentName: {
                        type: String,
                    },
                },
            ],
            monsters: [
                {
                    contentId: {
                        type: Schema.Types.ObjectId,
                        ref: 'Monster',
                    },
                    contentName: {
                        type: String,
                    },
                },
            ],
            spells: [
                {
                    contentId: {
                        type: Schema.Types.ObjectId,
                        ref: 'Spell',
                    },
                    contentName: {
                        type: String,
                    },
                },
            ],
            feats: [
                {
                    contentId: {
                        type: Schema.Types.ObjectId,
                        ref: 'Feat',
                    },
                    contentName: {
                        type: String,
                    },
                },
            ],
            backgrounds: [
                {
                    contentId: {
                        type: Schema.Types.ObjectId,
                        ref: 'Background',
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

// Instance methods
aetherscribeSchema.methods.getPublicInfo =
    function (): Partial<I_AetherScribeAccountProps> {
        return {
            id: this._id,
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

const AetherscribeAccount = model<I_AetherScribeAccountDocument>(
    'AetherscribeAccount',
    aetherscribeSchema
)

export default AetherscribeAccount
