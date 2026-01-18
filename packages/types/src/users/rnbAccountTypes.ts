import { T_ObjectId, T_Timestamp } from '../globalTypes'
import { I_SubscriptionProps } from './subscriptionTypes'

export interface I_RnBContent {
    playerCharacters: T_ObjectId[]
    worlds: T_ObjectId[]
    campaigns: T_ObjectId[]
}

export interface I_RnBAccount {
    identityId: T_ObjectId
    username: string
    avatar?: string
    content: I_RnBContent
    subscription?: I_SubscriptionProps
    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}
