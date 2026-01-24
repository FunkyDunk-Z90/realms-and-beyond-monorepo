import { T_ObjectId, T_Timestamp, T_ImageType } from '../globalTypes'
import { I_SubscriptionProps } from './subscriptionTypes'

export interface I_ContentObj {
    contentId: T_ObjectId
    contentName: string
}

export interface I_RnBContent {
    playerCharacters: I_ContentObj[]
    worlds: I_ContentObj[]
    campaigns: I_ContentObj[]
}

export interface I_RnBAccount {
    identityId: T_ObjectId
    username: string
    avatar?: T_ImageType
    content: I_RnBContent
    subscription?: I_SubscriptionProps
    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}
