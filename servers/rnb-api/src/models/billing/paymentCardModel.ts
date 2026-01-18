import { Schema } from 'mongoose'
import { I_PaymentCard } from '@rnb/types'

export const paymentCardSchema = new Schema<I_PaymentCard>(
    {
        nameOnCard: {
            type: String,
            required: true,
        },
        cardType: {
            type: String,
            enum: ['debit', 'maestro', 'mastercard', 'american-express'],
            required: true,
        },
        cardNumber: {
            type: String,
            required: true,
        },
        expiresOn: {
            type: String,
            required: true,
        },
        securityCode: String,
    },
    { _id: false }
)
