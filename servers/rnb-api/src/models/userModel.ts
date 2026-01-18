import { Schema, model, Document } from 'mongoose'
import { hash, compare } from 'bcrypt'
import { randomBytes, createHash } from 'crypto'

export interface iUser {
    firstNames: string[]
    lastName: string
    username: string
    email: string
    avatarURL: string
}

export interface iUserDoc extends iUser, Document {
    password: string | undefined
    passwordConfirm?: string
    passwordChangedAt?: Date
    passwordResetToken?: string | undefined
    passwordResetExpiresIn?: Date | undefined
    active: boolean
    getUserInfo(): void
    changedPasswordAfter(JWTTimestamp: Date): boolean
    correctPassword(
        candidatePassword: string,
        userPassword: string
    ): Promise<boolean>
    createPasswordResetToken(): string
}

const userSchema = new Schema<iUserDoc>(
    {
        firstNames: [
            {
                type: String,
                required: [true, 'please provide a first name'],
            },
        ],
        lastName: {
            type: String,
            required: [true, 'please provide a last name'],
        },
        username: {
            type: String,
            required: [true, 'please provide a username'],
            unique: true,
        },
        email: {
            type: String,
            required: [true, 'please provide a valid email'],
            unique: true,
            lowercase: true,
            validate: {
                validator: function (value: string) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                },
                message: 'Invalid email address format',
            },
        },
        password: {
            type: String,
            required: [true, 'please provide a valid password'],
            minLength: [3, 'password must be at least three characters'],
        },
        passwordConfirm: {
            type: String,
            required: [true, 'please confirm password'],
            validate: {
                validator: function (this: iUserDoc, value: string): boolean {
                    return value === this.password
                },
                message: 'passwords do not match!',
            },
            select: false,
        },
        avatarURL: String,
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpiresIn: Date,
        active: {
            type: Boolean,
            default: true,
            select: false,
        },
    },
    {
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }

    if (this.password) {
        this.password = await hash(this.password, 12)
    }

    this.passwordConfirm = undefined

    next()
})

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) {
        return next()
    }

    this.passwordChangedAt = new Date(Date.now() - 1000)
    next()
})

userSchema.methods.correctPassword = async function (
    candidatePassword: string,
    userPassword: string
) {
    return await compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: Date) {
    if (this.passwordChangedAt instanceof Date) {
        const changedTimestamp = this.passwordChangedAt.getTime() / 1000
        return JWTTimestamp.getTime() < changedTimestamp
    }

    return false
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = randomBytes(32).toString('hex')

    this.passwordResetToken = createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.passwordResetExpiresIn = new Date(Date.now() + 10 * 60 * 1000)

    return resetToken
}

userSchema.methods.getUserInfo = function () {
    const { _id, email, username, firstNames, lastName, codex, avatarURL } =
        this

    return {
        id: _id,
        email,
        username,
        firstNames,
        lastName,
        codex,
        avatarURL,
    }
}

const User = model<iUserDoc>('User', userSchema)

export default User
