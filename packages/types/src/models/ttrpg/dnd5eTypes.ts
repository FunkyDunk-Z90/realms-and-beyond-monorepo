export type T_DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100'
export type T_RestType = 'short-rest' | 'long-rest'
export type T_AbilityAbbrev = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA'
export type T_AbilityNames =
    | 'strength'
    | 'dexterity'
    | 'constitution'
    | 'intelligence'
    | 'wisdom'
    | 'charisma'
export type T_SpellcasterType = 'full' | 'third' | 'half' | 'custom' | null
export type T_CreatureSize =
    | 'tiny'
    | 'small'
    | 'medium'
    | 'large'
    | 'huge'
    | 'gargantuan'

export type T_PhysicalDamageType = 'piercing' | 'bludgeoning' | 'slashing'
export type T_ElementalDamageType =
    | 'acid'
    | 'cold'
    | 'fire'
    | 'lightning'
    | 'poison'
    | 'thunder'
export type T_MagicalDamageType =
    | 'force'
    | 'necrotic'
    | 'radiant'
    | 'psychic'
    | 'resonant'
    | 'aetheric'
export type T_DamageType =
    | T_PhysicalDamageType
    | T_ElementalDamageType
    | T_MagicalDamageType

export type T_Action = 'action' | 'bonus' | 'reaction'

export interface I_DamageProps {
    damageType?: T_DamageType
    damageDie: T_DieType
    dieQuantity: number
    damageMod: number
}

export interface I_HealthPoints {
    maxHp: number
    currentHp: number
    hitDie: {
        dieType: T_DieType
        quantity: number
    }
    temporaryHp: number
}

export interface I_ArmourClass {
    baseAC: number
    dex: number
    otherBonus: number
}

export interface I_AbilityProps {
    abilityName: T_AbilityNames
    abilityAbbrev: T_AbilityAbbrev
}

export interface I_AbilityScore {
    abilityScore: number
    abilityMod: number
    abilityName: I_AbilityProps
}

export interface I_Skill {
    skillName: string
    skillMod: number
    ability: I_AbilityProps
    isProficient: boolean
    skillBonus: number
    hasAdvantage: boolean
}

export interface I_SavingThrow {
    ability: I_AbilityProps
    savingThrowMod: number
    savingThrowBonus: number
    isProficient: boolean
    hasAdvantage: boolean
}

export interface I_Initiative {
    initiativeMod: number
    initiativeBonus: number
    hasAdvantage: boolean
}

export interface I_Speed {
    walking: number
    swimming: number
    flying: number
}

export interface I_DeathSaves {
    successes: {
        max: number
        current: number
    }
    failures: {
        max: number
        current: number
    }
}
