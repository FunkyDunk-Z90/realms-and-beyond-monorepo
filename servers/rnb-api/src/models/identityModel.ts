import { Schema, model } from 'mongoose'
import { hash, compare } from 'bcrypt'
import { I_Identity } from '@rnb/types'
import { contactSchema } from './contactModel'

const identitySchema = new Schema<I_Identity>(
    {
        password: {
            type: String,
            required: true,
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, 'please confirm password'],
            validate: {
                validator: function (this: I_Identity, value: string): boolean {
                    return value === this.password
                },
                message: 'passwords do not match!',
            },
            select: false,
        },

        profile: {
            firstName: {
                type: String,
                required: true,
            },
            lastNames: {
                type: [String],
                required: true,
            },
            dateOfBirth: String,
            placeOfBirth: String,
            nationality: String,
        },

        contact: {
            type: contactSchema,
            required: true,
        },

        lifecycle: {
            status: {
                type: String,
                enum: ['active', 'soft-deleted', 'banned'],
                default: 'active',
            },
            deletedAt: Date,
            recoverableUntil: Date,
        },

        accounts: [
            {
                type: Schema.Types.ObjectId,
            },
        ],

        lastLoginAt: Date,
    },
    { timestamps: true }
)

identitySchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await hash(this.password, 12)
    next()
})

identitySchema.methods.correctPassword = function (
    candidate: string,
    stored: string
) {
    return compare(candidate, stored)
}

export const Identity = model<I_Identity>('Identity', identitySchema)
