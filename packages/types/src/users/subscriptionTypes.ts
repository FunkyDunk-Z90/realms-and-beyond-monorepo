import { T_ObjectId, T_Timestamp } from '../globalTypes'

import {
    I_OverduePaymentProps,
    I_PaymentMethodProps,
} from '../personalData/paymentTypes'

export type T_SubscriptionTier =
    | 'basic'
    | 'premium'
    | 'premium-plus'
    | 'family'
    | 'duo'

export type T_SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'expired'

export type T_RenewelCycle =
    | 'never'
    | '1-month'
    | '3-months'
    | '6-months'
    | '12-months'
    | '18-months'
    | '24-months'

export interface I_SubscriptionProps {
    tier: T_SubscriptionTier
    status: T_SubscriptionStatus
    startedOn: T_Timestamp
    expiresOn: T_Timestamp
    renewsOn: T_Timestamp
    renewlCycle: T_RenewelCycle
    linkedUsers?: T_ObjectId[]
    overduePayments?: I_OverduePaymentProps[]
    paymentMethods: I_PaymentMethodProps[]
}
