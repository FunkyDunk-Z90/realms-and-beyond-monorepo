import { Schema } from 'mongoose'
import { I_ContactProps } from '@rnb/types'

export const phoneNumberSchema = new Schema(
    {
        countryCode: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
    },
    { _id: false }
)

export const addressSchema = new Schema(
    {
        companyName: String,
        addressLine1: {
            type: String,
            required: true,
        },
        houseNumber: String,
        addressLine2: String,
        city: {
            type: String,
            required: true,
        },
        county: String,
        postcode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
    },
    { _id: false }
)

export const contactSchema = new Schema<I_ContactProps>(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
        },
        phoneNumber: {
            type: phoneNumberSchema,
            required: true,
        },
        address: {
            type: addressSchema,
            required: true,
        },
    },
    { _id: false }
)
