import { Types } from 'mongoose'

export interface I_InventorySlot {
    item: Types.ObjectId[] | string[]
    maxCapacity: number
    currentCapacity: number
}

export interface I_InventoryProps {
    slots: I_InventorySlot[]
    maxSlots?: number
}
