import { Types } from 'mongoose'

export type T_AbilityAbbrev = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA'

export type T_SpellcastingType = 'full' | 'half' | 'third' | 'pact' | 'none'

export interface I_FeatureUses {
    per: 'short_rest' | 'long_rest' | 'proficiency_bonus' | 'custom' | null
    amount: number | null
    customNote: string | null
}

export interface I_ClassFeature {
    featureName: string
    level: number
    description: string
    tags: string[]
    uses: I_FeatureUses
}

export interface I_Spellcasting {
    hasSpellcasting: boolean
    spellcastingType: T_SpellcastingType
    spellcastingAbility: T_AbilityAbbrev | null
    // e.g. "1" -> 3 cantrips at level 1
    cantripsKnownByLevel: Map<string, number>
    // e.g. "5" -> 8 spells known at level 5
    spellsKnownByLevel: Map<string, number>
    // e.g. "5" -> [4, 3, 2, 0...] spell slots
    spellSlotsByLevel: Map<string, number[]>
    // e.g. ["wizard", "warlock"] or ["custom"]
    spellListSources: string[]
}

export interface I_ClassLevel {
    level: number
    proficiencyBonus: number
    features: I_ClassFeature[]
    // extra per-level numeric info if needed ("extraAttacks", etc.)
    spellcastingProgression: Map<string, number>
    notes: string | null
}

export interface I_Subclass {
    name: string
    identifier: string // slug, e.g. "eldritch-knight"
    description: string
    selectionLevel: number
    // key: level -> list of features gained at that level
    features: Map<string, I_ClassFeature[]>
}

export interface I_RnBClass extends Document {
    name: string
    identifier: string
    source: string
    description: string

    hitDie: 6 | 8 | 10 | 12

    primaryAbilities: T_AbilityAbbrev[]
    savingThrowProficiencies: T_AbilityAbbrev[]

    proficiencies: {
        armor: string[]
        weapons: string[]
        tools: string[]
        savingThrows: T_AbilityAbbrev[]
        skillChoices: {
            from: string[]
            choose: number
        }[]
    }

    startingEquipmentOptions: string[]

    levels: I_ClassLevel[]

    spellcasting: I_Spellcasting

    subclasses: I_Subclass[]

    createdBy: Types.ObjectId | null
    isHomebrew: boolean
    tags: string[]

    toClient(): void
}
