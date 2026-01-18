import { Types } from 'mongoose'
import { I_ItemProps, T_ItemCategory } from './ttrpgItemTypes'

export type T_MaterialType = 'raw' | 'worked' | 'refined'
export type T_RawMaterialType = 'mineral' | 'flora' | 'fauna'
export type T_WorkedMaterialType = 'ingot' | 'billet' | 'powder' | 'grain'
export type T_CratingMaterialType = 'component' | 'solution'

export interface I_SchematicItem {
    item: I_ItemProps
    quantityRequired: number
}

export interface I_SchematicProps {
    requiredItems: I_SchematicItem[]
}

export interface I_CraftingProps {
    craftableId: Types.ObjectId | string
    materialType: T_CratingMaterialType
    isRawMaterial: boolean
    isWorkedMaterial: boolean
    isComponent: boolean
    rawMaterialType?: T_RawMaterialType
    workedMaterialType?: T_WorkedMaterialType
    componentType?: T_ItemCategory
    schematic: I_SchematicProps
}
