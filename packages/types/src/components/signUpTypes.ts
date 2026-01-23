export interface I_SignUpDataProps {
    profile: {
        firstName: string
        lastNames: string
        dateOfBirth: string
        nationality: string
    }
    contact: {
        email: string
    }
    password: string
    passwordConfirm: string
}
