import { Schema } from 'mongoose'
import { I_PaymentIban } from '@rnb/types'

export const paymentIbanSchema = new Schema<I_PaymentIban>(
    {
        countryCode: {
            type: String,
            required: true,
        },
        ibanNo: {
            type: String,
            required: true,
        },
        bic: String,
    },
    { _id: false }
)
