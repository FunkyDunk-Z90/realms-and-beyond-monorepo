import { I_Address } from './contactTypes'

export interface I_PaymentCard {
    nameOnCard: string
    cardType: 'debit' | 'maestro' | 'mastercard' | 'american-express'
    cardNumber: string
    expiresOn: string
    securityCode?: string
}

export interface I_PaymentIban {
    countryCode: string
    ibanNo: string
    bic: string
}

export interface I_BankDetails {
    accountHolder: string
    accountNo: string
    sortCode: string
    bankAddress: I_Address
}

export interface I_OverduePaymentProps {
    timesMissed: number
    dateDue: Date | string
    interest: number | string
    isPaid: boolean
    datePaid: Date | string
}

export interface I_PaymentMethodProps {
    paymentMethod: 'card' | 'iban'
    isDefault: boolean
    card?: I_PaymentCard
    iban?: I_PaymentIban
}
