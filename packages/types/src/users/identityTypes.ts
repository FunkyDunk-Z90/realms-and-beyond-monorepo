import { T_ObjectId, T_Timestamp } from '../globalTypes'
import { I_ContactProps } from '..'

export type T_IdentityStatus = 'active' | 'soft-deleted' | 'banned'

export type T_UserRoles = 'user' | 'admin' | 'executive-admin'

export interface I_IdentityLifecycle {
    status: T_IdentityStatus
    deletedAt?: T_Timestamp
    recoverableUntil?: T_Timestamp
}

export interface I_IdentityProfile {
    firstName: string
    lastNames: string[]
    dateOfBirth?: string
    nationality?: string
}

export interface I_Identity {
    id: T_ObjectId
    password: string
    passwordConfirm?: string
    profile: I_IdentityProfile
    contact: I_ContactProps
    lifecycle: I_IdentityLifecycle
    createdAt: T_Timestamp
    updatedAt: T_Timestamp
    lastLoginAt?: T_Timestamp
    accounts: T_ObjectId[]
}
