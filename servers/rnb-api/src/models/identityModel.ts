import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcrypt'
import { createHash, randomBytes } from 'crypto'
import { I_Identity } from '@rnb/types'
import { formatDate } from '../utils/formateDate'

interface I_IdentityDocument extends Omit<I_Identity, 'id'>, Document {
    password: string
    passwordConfirm?: string
    passwordChangedAt?: Date
    passwordResetToken?: string
    passwordResetExpiresIn?: Date
    correctPassword(
        candidatePassword: string,
        userPassword: string
    ): Promise<boolean>
    changedPasswordAfter(JWTTimestamp: Date): boolean
    createPasswordResetToken(): string
    getPublicInfo(): Partial<I_Identity>
}

const identitySchema = new Schema<I_IdentityDocument>(
    {
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 9,
            select: false,
        },
        passwordConfirm: {
            type: String,
            validate: {
                validator: function (this: I_IdentityDocument, val: string) {
                    return val === this.password
                },
                message: 'Passwords do not match',
            },
        },
        profile: {
            firstName: {
                type: String,
                required: [true, 'First name is required'],
                trim: true,
            },
            lastNames: {
                type: [String],
                required: [true, 'Last names are required'],
                validate: {
                    validator: (v: string[]) => v && v.length > 0,
                    message: 'At least one last name is required',
                },
            },
            dateOfBirth: {
                type: String,
            },
            nationality: {
                type: String,
            },
        },
        contact: {
            email: {
                type: String,
                required: [true, 'Email is required'],
                unique: true,
                lowercase: true,
                trim: true,
                match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
            },
            phoneNumber: {
                type: String,
                trim: true,
            },
            address: {
                addressLine1: String,
                addressLine2: String,
                city: String,
                state: String,
                postcode: String,
                country: String,
            },
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
        lastLoginAt: {
            type: Date,
        },
        accounts: [
            {
                type: Schema.Types.ObjectId,
                refPath: 'accountModel',
            },
        ],
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpiresIn: Date,
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

// Indexes
identitySchema.index({ 'contact.email': 1 })
identitySchema.index({ 'lifecycle.status': 1 })

// Pre-save middleware for password hashing
identitySchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined

    if (!this.isNew) {
        this.passwordChangedAt = new Date(Date.now() - 1000)
    }

    next()
})

// Instance methods
identitySchema.methods.correctPassword = async function (
    candidatePassword: string,
    userPassword: string
): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, userPassword)
}

identitySchema.methods.changedPasswordAfter = function (
    JWTTimestamp: Date
): boolean {
    if (this.passwordChangedAt) {
        const changedTimestamp = this.passwordChangedAt.getTime()
        return JWTTimestamp.getTime() < changedTimestamp
    }
    return false
}

identitySchema.methods.createPasswordResetToken = function (): string {
    const resetToken = randomBytes(32).toString('hex')

    this.passwordResetToken = createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.passwordResetExpiresIn = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    return resetToken
}

identitySchema.methods.getPublicInfo = function (): Partial<I_Identity> {
    return {
        id: this._id,
        profile: this.profile,
        contact: {
            email: this.contact.email,
            phoneNumber: this.contact.phoneNumber,
            address: this.contact.address,
        },
        lifecycle: this.lifecycle,
        lastLoginAt: formatDate(this.lastLoginAt),
        accounts: this.accounts,
        createdAt: formatDate(this.createdAt),
        updatedAt: formatDate(this.updatedAt),
    }
}

const Identity = model<I_IdentityDocument>('Identity', identitySchema)

export default Identity
