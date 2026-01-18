export interface I_PhoneNumber {
    countryCode: string
    phoneNumber: string
}

export interface I_Address {
    companyName?: string
    addressLine1: string
    addressLine2?: string
    city: string
    county?: string
    postcode: string
    country: string
}

export interface I_ContactProps {
    address: I_Address
    phoneNumber: I_PhoneNumber
    email: string
}
