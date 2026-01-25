import { Types } from 'mongoose'
import { StaticImageData } from 'next/image'

export type T_ObjectId = Types.ObjectId | string
export type T_Timestamp = Date | string
export type T_ImageType = StaticImageData | string

export type T_Sizes = 'tiny' | 'small' | 'medium' | 'large' | 'x-large'

export interface I_Note {
    noteTitle?: string
    contents: string[]
    links?: string[]
    images?: string[]
    isBullet: boolean
}

export interface I_Paras {
    paraTitle?: string
    contents: I_Note[]
}

export interface I_TextProps {
    sectionTitle?: string
    paras: I_Paras[]
}

export type T_DistanceMetrics = 'meters' | 'kilometres' | 'miles' | 'yards'
export type T_DistanceAbbrev = 'm' | 'km' | 'yds'
export type T_WeightMetrics = 'grams' | 'kilograms' | 'pounds' | 'ounces'
export type T_WeightAbbrev = 'g' | 'kg' | 'lbs' | 'oz'
