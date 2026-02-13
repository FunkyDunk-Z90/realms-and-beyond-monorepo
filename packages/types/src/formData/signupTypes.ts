import { T_RenewelCycle, T_SubscriptionTier } from '../users/subscriptionTypes'

export interface I_AetherscribeSignup {
    firstName: string
    lastName: string
    dateOfBirth: string
    nationality: string
    email: string
    username: string
    password: string
    passwordConfirm: string
    renewelCycle: T_RenewelCycle
    subscriptionTier: T_SubscriptionTier
}
