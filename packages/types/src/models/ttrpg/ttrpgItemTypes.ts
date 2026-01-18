import { Types } from 'mongoose'
import { T_ObjectId, T_Sizes, I_TextProps } from '../../globalTypes'
import { I_DamageProps, T_Action } from './dnd5eTypes'
import { T_EquipSlotType } from './ttrpgEquipmentTypes'
import { I_CraftingProps } from './ttrpgCraftingTypes'

export type T_ItemCategory =
    | 'weapon'
    | 'armour'
    | 'consumable'
    | 'valuable'
    | 'misc'
    | 'material'
    | 'container'
    | 'tool'
    | 'artifact'
    | 'apparel'
    | 'houseware'
    | 'arcTech'
export type T_ItemTags = 'magical' | 'non-magical' | 'craftable' | 'single-use'

export type T_WeaponCategory =
    | 'simple-melee'
    | 'martial-melee'
    | 'simple-ranged'
    | 'martial-ranged'
export type T_WeaponProperties =
    | 'finesse'
    | 'heavy'
    | 'light'
    | 'loading'
    | 'range'
    | 'reach'
    | 'special'
    | 'thrown'
    | 'two-handed'
    | 'silvered'
    | 'ammunition'
export type T_WeaponMasteries =
    | 'cleave'
    | 'graze'
    | 'nick'
    | 'push'
    | 'sap'
    | 'slow'
    | 'topple'
    | 'vex'

export type T_ArmourProperties = 'light' | 'medium' | 'heavy' | 'shield'
export type T_ArmourLight = 'padded' | 'leather' | 'studded-leather'
export type T_ArmourMedium =
    | 'hide'
    | 'chain-shirt'
    | 'breastplate'
    | 'half-plate'
export type T_ArmourHeavy = 'ring-mail' | 'chain-mail' | 'splint' | 'plate'
export type T_ArmourCategory =
    | T_ArmourLight
    | T_ArmourMedium
    | T_ArmourHeavy
    | 'shield'

export type T_ConsumableType =
    | 'potion'
    | 'poison'
    | 'elixir'
    | 'remedy'
    | 'beverage'
    | 'ingredient'
    | 'meal'
    | 'ration'

export type T_ValuableType = 'currency' | 'jewelry' | 'treasure'

export interface I_ContainerProps extends I_ItemProps {
    containerId: T_ObjectId
    containerSize: T_Sizes
    containerName: string
    items: I_ItemProps[]
    maxVolume: number
    currentVolume: number
}

export interface I_WeaponProps extends I_ItemProps {
    weaponCategory: T_WeaponCategory
    weaponProperties: T_WeaponProperties[]
    damageType: I_DamageProps
    weaponMasteries: T_WeaponMasteries[]
}

export interface T_ArmourProps extends I_ItemProps {
    baseArmourClass: number
    armourClassMod: number
    stealthDisadvantage: boolean
    armourProperties: T_ArmourProperties
    armourCategory: T_ArmourCategory
    strengthRequirement?: number
    donTime: T_Action | number
    donOffTime: T_Action | number
}

export interface I_ItemProps {
    itemId: Types.ObjectId | string
    owner: Types.ObjectId | string
    itemName: string
    itemDescription: I_TextProps
    itemCategory: T_ItemCategory
    itemTags: T_ItemTags[]
    isCraftable: boolean
    craftingProps?: I_CraftingProps
    baseValue: number
    valueMod: number
    weight: number
    isEquipable: boolean
    equipmentSlot: T_EquipSlotType[]
}
