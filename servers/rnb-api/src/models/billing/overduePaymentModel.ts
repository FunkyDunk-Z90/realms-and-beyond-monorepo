import { Schema } from 'mongoose'
import { I_OverduePaymentProps } from '@rnb/types'

export const overduePaymentSchema = new Schema<I_OverduePaymentProps>(
    {
        isOverdue: {
            type: Boolean,
            required: true,
        },
        timesMissed: {
            type: Number,
            required: true,
        },
        dateDue: {
            type: Date,
            required: true,
        },
        interest: {
            type: Schema.Types.Mixed, // number | string per TS type
            required: true,
        },
        isPaid: {
            type: Boolean,
            required: true,
        },
        datePaid: Date,
    },
    { _id: false }
)
