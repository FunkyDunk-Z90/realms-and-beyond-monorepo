import { T_ObjectId, T_Timestamp, T_ImageType } from '../globalTypes'
import { I_SubscriptionProps } from './subscriptionTypes'

export interface I_ContentObj {
    contentId: T_ObjectId
    contentName: string
}

export interface I_AetherScribeContent {
    playerCharacters: I_ContentObj[]
    worlds: I_ContentObj[]
    campaigns: I_ContentObj[]
    items: I_ContentObj[]
    classes: I_ContentObj[]
    ancestries: I_ContentObj[]
    monsters: I_ContentObj[]
    spells: I_ContentObj[]
    feats: I_ContentObj[]
    backgrounds: I_ContentObj[]
}

export interface I_AetherScribeAccountProps {
    id: T_ObjectId
    identityId: T_ObjectId
    username: string
    avatar?: T_ImageType
    content: I_AetherScribeContent
    subscription?: I_SubscriptionProps
    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}
