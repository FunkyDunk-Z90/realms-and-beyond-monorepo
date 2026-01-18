import { Schema, model, Document, Types } from 'mongoose'
import {
    I_RnBClass,
    I_FeatureUses,
    I_ClassFeature,
    I_Spellcasting,
    I_ClassLevel,
    I_Subclass,
} from '@rnb/types'

// --------- Sub-schemas ---------

const FeatureUsesSchema = new Schema<I_FeatureUses>(
    {
        per: {
            type: String,
            enum: [
                'short_rest',
                'long_rest',
                'proficiency_bonus',
                'custom',
                null,
            ],
            default: null,
        },
        amount: {
            type: Number,
            default: null,
        },
        customNote: {
            type: String,
            default: null,
        },
    },
    { _id: false }
)

const ClassFeatureSchema = new Schema<I_ClassFeature>(
    {
        featureName: {
            type: String,
            required: true,
        },
        level: {
            type: Number,
            required: true,
            min: 1,
            max: 20,
        },
        description: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        uses: {
            type: FeatureUsesSchema,
            default: () => ({
                per: null,
                amount: null,
                customNote: null,
            }),
        },
    },
    { _id: false }
)

const SpellcastingSchema = new Schema<I_Spellcasting>(
    {
        hasSpellcasting: {
            type: Boolean,
            default: false,
        },
        spellcastingType: {
            type: String,
            enum: ['full', 'half', 'third', 'pact', 'none'],
            default: 'none',
        },
        spellcastingAbility: {
            type: String,
            enum: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA', null],
            default: null,
        },
        cantripsKnownByLevel: {
            type: Map,
            of: Number,
            default: {},
        },
        spellsKnownByLevel: {
            type: Map,
            of: Number,
            default: {},
        },
        spellSlotsByLevel: {
            type: Map,
            of: [Number],
            default: {},
        },
        spellListSources: {
            type: [String],
            default: [],
        },
    },
    { _id: false }
)

const ClassLevelSchema = new Schema<I_ClassLevel>(
    {
        level: {
            type: Number,
            required: true,
            min: 1,
            max: 20,
        },
        proficiencyBonus: {
            type: Number,
            required: true,
        },
        features: {
            type: [ClassFeatureSchema],
            default: [],
        },
        spellcastingProgression: {
            type: Map,
            of: Number,
            default: {},
        },
        notes: {
            type: String,
            default: null,
        },
    },
    { _id: false }
)

const SubclassSchema = new Schema<I_Subclass>(
    {
        name: {
            type: String,
            required: true,
        },
        identifier: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        selectionLevel: {
            type: Number,
            required: true,
            min: 1,
            max: 20,
        },
        features: {
            type: Map,
            of: [ClassFeatureSchema],
            default: {},
        },
    },
    { _id: false }
)

// --------- Main Class Schema ---------

const ClassSchema = new Schema<I_RnBClass>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        identifier: {
            type: String,
            required: true,
            unique: true,
        },
        source: {
            type: String,
            default: 'Homebrew',
        },
        description: {
            type: String,
            required: true,
        },
        hitDie: {
            type: Number,
            enum: [6, 8, 10, 12],
            required: true,
        },
        primaryAbilities: {
            type: [String],
            enum: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'],
            required: true,
        },
        savingThrowProficiencies: {
            type: [String],
            enum: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'],
            required: true,
        },
        proficiencies: {
            armor: {
                type: [String],
                default: [],
            },
            weapons: {
                type: [String],
                default: [],
            },
            tools: {
                type: [String],
                default: [],
            },
            savingThrows: {
                type: [String],
                enum: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'],
                default: [],
            },
            skillChoices: [
                {
                    from: {
                        type: [String],
                        default: [],
                    },
                    choose: {
                        type: Number,
                        default: 0,
                    },
                },
            ],
        },
        startingEquipmentOptions: {
            type: [String],
            default: [],
        },
        levels: {
            type: [ClassLevelSchema],
            default: [],
        },
        spellcasting: {
            type: SpellcastingSchema,
            default: () => ({}),
        },
        subclasses: {
            type: [SubclassSchema],
            default: [],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        isHomebrew: {
            type: Boolean,
            default: true,
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
)

// Optional index for subclass identifiers per class
ClassSchema.index(
    { identifier: 1, 'subclasses.identifier': 1 },
    { unique: false }
)

ClassSchema.methods.toClient = function () {
    const doc = this.toObject({ virtuals: false })

    return {
        id: doc._id.toString(),
        name: doc.name,
        identifier: doc.identifier,
        source: doc.source,
        description: doc.description,
        hitDie: doc.hitDie,
        primaryAbilities: doc.primaryAbilities,
        savingThrowProficiencies: doc.savingThrowProficiencies,
        proficiencies: doc.proficiencies,
        startingEquipmentOptions: doc.startingEquipmentOptions,
        levels: doc.levels,
        spellcasting: doc.spellcasting,
        subclasses: doc.subclasses,
        tags: doc.tags,
    }
}

export const RnBClassModel = model<I_RnBClass>('RnBClass', ClassSchema)
