import { Types } from 'mongoose'

export type T_EquipSlotType = 'armour' | 'weapon' | 'artifact' | 'consumable'

export interface I_EquipmentSlotProps {
    slotType: T_EquipSlotType
    equipedItem?: Types.ObjectId | string
    isSlotDisabled: boolean
    isSlotActive: boolean
}

export interface I_AttunementSlot {
    slotType: 'artifact'
    attunedItem: Types.ObjectId | 'string'
    isSlotActive: boolean
}

export interface I_ArmourSlotProps {
    head: I_EquipmentSlotProps
    torso: I_EquipmentSlotProps
    leftShoulder: I_EquipmentSlotProps
    rightShoulder: I_EquipmentSlotProps
    leftArm: I_EquipmentSlotProps
    rightArm: I_EquipmentSlotProps
    leftHand: I_EquipmentSlotProps
    rightHand: I_EquipmentSlotProps
    waist: I_EquipmentSlotProps
    legs: I_EquipmentSlotProps
    feet: I_EquipmentSlotProps
    cloak: I_EquipmentSlotProps
}

export interface I_WeaponSlotProps {
    leftHand: I_EquipmentSlotProps
    rightHand: I_EquipmentSlotProps
}

export interface I_AttunementSlotProps {
    slot1: I_AttunementSlot
    slot2: I_AttunementSlot
    slot3: I_AttunementSlot
}

export interface I_EquipmentSlotProps {
    armour: I_ArmourSlotProps
    weapons: I_WeaponSlotProps
    attunedItems: I_AttunementSlotProps
}
