import { Schema, model, Document } from 'mongoose'
import { hash, compare } from 'bcrypt'
import { randomBytes, createHash } from 'crypto'
import { I_UserProps, T_ObjectId } from '@rnb/types'

// Extended document interface for Mongoose methods
export interface I_UserDocument extends I_UserProps, Document {
    password: string
    passwordConfirm?: string
    passwordChangedAt?: Date
    passwordResetToken?: string
    passwordResetExpiresIn?: Date

    // Methods
    correctPassword(
        candidatePassword: string,
        userPassword: string
    ): Promise<boolean>
    changedPasswordAfter(JWTTimestamp: Date): boolean
    createPasswordResetToken(): string
    getUserInfo(): object
}

// Contact Schema
const contactSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            validate: {
                validator: function (value: string) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                },
                message: 'Invalid email address format',
            },
        },
        phoneNumber: String,
        address: {
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
        },
    },
    { _id: false }
)

// Payment Card Schema
const paymentCardSchema = new Schema(
    {
        cardNumber: { type: String, required: true },
        cardHolderName: { type: String, required: true },
        expiryDate: { type: String, required: true },
        cvv: String,
        isDefault: { type: Boolean, default: false },
    },
    { _id: false }
)

// Payment IBAN Schema
const paymentIbanSchema = new Schema(
    {
        iban: { type: String, required: true },
        accountHolderName: { type: String, required: true },
        bankName: String,
        isDefault: { type: Boolean, default: false },
    },
    { _id: false }
)

// Overdue Payment Schema
const overduePaymentSchema = new Schema(
    {
        amount: { type: Number, required: true },
        dueDate: { type: Date, required: true },
        description: String,
    },
    { _id: false }
)

// Membership Schema - Reusable for all services
const membershipSchema = new Schema(
    {
        tier: {
            type: String,
            enum: ['basic', 'premium', 'premium-plus', 'family', 'duo'],
            required: true,
        },
        linkedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        membershipStatus: {
            type: String,
            enum: ['active', 'paused', 'cancelled', 'expired'],
            required: true,
        },
        startedOn: { type: Date, required: true },
        expiresOn: { type: Date, required: true },
        renewsOn: { type: Date, required: true },
        isRecurring: { type: Boolean, default: true },
        linkedMembers: { type: Schema.Types.ObjectId, ref: 'User' },
        overduePayments: [overduePaymentSchema],
        savedPaymentOptions: {
            paymentCard: [paymentCardSchema],
            paymentIban: [paymentIbanSchema],
        },
    },
    { _id: false }
)

// RnB Content Schema
const rnbContentSchema = new Schema(
    {
        playerCharacters: [
            { type: Schema.Types.ObjectId, ref: 'PlayerCharacter' },
        ],
        worlds: [{ type: Schema.Types.ObjectId, ref: 'World' }],
        campaigns: [{ type: Schema.Types.ObjectId, ref: 'Campaign' }],
    },
    { _id: false }
)

// RnB Account Schema - Extends membership
const rnbAccountSchema = new Schema(
    {
        accountId: { type: Schema.Types.ObjectId, required: true },
        userName: { type: String, required: true },
        avatar: String,
        userContent: rnbContentSchema,
        // Embedded membership
        ...membershipSchema.obj,
    },
    { _id: false }
)

// NexusServe Account Schema - Extends membership
const nexusServeAccountSchema = new Schema(
    {
        accountId: { type: Schema.Types.ObjectId, required: true },
        employeeId: { type: String, required: true, unique: true },
        department: String,
        position: String,
        hireDate: { type: Date, required: true },
        managerId: { type: Schema.Types.ObjectId, ref: 'User' },
        accessLevel: {
            type: String,
            enum: ['basic', 'manager', 'admin', 'executive'],
            default: 'basic',
        },
        workSchedule: {
            hoursPerWeek: Number,
            workDays: [String],
        },
        // Embedded membership
        ...membershipSchema.obj,
    },
    { _id: false }
)

// Basic Info Schema
const basicInfoSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            default: function (this: { _id: T_ObjectId }): T_ObjectId {
                return this._id
            },
            immutable: true,
        },
        firstName: { type: String, required: [true, 'First name is required'] },
        lastNames: [{ type: String, required: true }],
        dateOfBirth: {
            type: String,
            required: [true, 'Date of birth is required'],
        },
        placeOfBirth: String,
        nationality: String,
        userRoles: [
            {
                type: String,
                enum: [
                    'user',
                    'member',
                    'employee',
                    'admin',
                    'executive-admin',
                    'gm',
                    'player',
                ],
                required: true,
            },
        ],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        lastLoginAt: Date,
        userStatus: {
            type: String,
            enum: ['active', 'inactive', 'banned', 'pending'],
            default: 'active',
        },
        contact: { type: contactSchema, required: true },
    },
    { _id: false }
)

// Main User Schema
const userSchema = new Schema<I_UserDocument>(
    {
        basicInfo: { type: basicInfoSchema, required: true },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, 'Password must be at least 8 characters'],
            select: false,
        },
        passwordConfirm: {
            type: String,
            validate: {
                validator: function (
                    this: I_UserDocument,
                    value: string
                ): boolean {
                    return value === this.password
                },
                message: 'Passwords do not match',
            },
            select: false,
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpiresIn: Date,

        // Standalone membership for general platform access
        membership: membershipSchema,
        // Service-specific accounts with embedded membership
        rnbAccount: rnbAccountSchema,
        nexusServeAccount: nexusServeAccountSchema,
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

// Indexes for performance
// userSchema.index({ 'basicInfo.contact.email': 1 })
// userSchema.index({ 'basicInfo.userId': 1 })
// userSchema.index({ 'nexusServeAccount.employeeId': 1 })
// userSchema.index({ 'rnbAccount.userName': 1 })

// Pre-save middleware for password hashing
userSchema.pre('save', async function (this: I_UserDocument, next) {
    if (!this.isModified('password')) {
        return next()
    }

    if (this.password) {
        this.password = await hash(this.password, 12)
    }

    this.passwordConfirm = undefined
    next()
})

// Pre-save middleware for password change timestamp
userSchema.pre('save', function (this: I_UserDocument, next) {
    if (!this.isModified('password') || this.isNew) {
        return next()
    }

    this.passwordChangedAt = new Date(Date.now() - 1000)
    next()
})

// Pre-save middleware to update basicInfo.updatedAt
userSchema.pre('save', function (next) {
    if (this.isModified() && !this.isNew) {
        this.basicInfo.updatedAt = new Date()
    }
    next()
})

// Instance method to verify password
userSchema.methods.correctPassword = async function (
    candidatePassword: string,
    userPassword: string
): Promise<boolean> {
    return await compare(candidatePassword, userPassword)
}

// Instance method to check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (
    JWTTimestamp: Date
): boolean {
    if (this.passwordChangedAt instanceof Date) {
        const changedTimestamp = this.passwordChangedAt.getTime() / 1000
        return JWTTimestamp.getTime() < changedTimestamp
    }
    return false
}

// Instance method to create password reset token
userSchema.methods.createPasswordResetToken = function (): string {
    const resetToken = randomBytes(32).toString('hex')

    this.passwordResetToken = createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.passwordResetExpiresIn = new Date(Date.now() + 10 * 60 * 1000)

    return resetToken
}

// Instance method to get sanitized user info
userSchema.methods.getUserInfo = function () {
    const { basicInfo, membership, rnbAccount, nexusServeAccount } = this

    return {
        // id: _id,
        userId: basicInfo.userId,
        firstName: basicInfo.firstName,
        lastNames: basicInfo.lastNames,
        contact: basicInfo.contact,
        // email: basicInfo.contact.email,
        userRoles: basicInfo.userRoles,
        userStatus: basicInfo.userStatus,
        membership: membership
            ? {
                  tier: membership.tier,
                  status: membership.membershipStatus,
              }
            : undefined,
        rnbAccount: rnbAccount
            ? {
                  accountId: rnbAccount.accountId,
                  userName: rnbAccount.userName,
                  avatar: rnbAccount.avatar,
                  membership: {
                      tier: rnbAccount.tier,
                      status: rnbAccount.membershipStatus,
                  },
              }
            : undefined,
        nexusServeAccount: nexusServeAccount
            ? {
                  accountId: nexusServeAccount.accountId,
                  employeeId: nexusServeAccount.employeeId,
                  department: nexusServeAccount.department,
                  position: nexusServeAccount.position,
                  membership: {
                      tier: nexusServeAccount.tier,
                      status: nexusServeAccount.membershipStatus,
                  },
              }
            : undefined,
    }
}

const User = model<I_UserDocument>('User', userSchema)

export default User
