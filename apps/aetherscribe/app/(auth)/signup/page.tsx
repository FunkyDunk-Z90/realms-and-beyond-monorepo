'use client'

import { useUser } from '@/lib/context/UserContext'
import { Form } from '@rnb/modularix'
import { I_AetherscribeSignup, I_DropdownOption } from '@rnb/types'

const formDataInit: I_AetherscribeSignup = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
    renewelCycle: 'never',
    subscriptionTier: 'basic',
}

const subDetailsInit: I_DropdownOption[] = [
    {
        id: 'basic',
        label: 'Basic',
        description: 'Free account',
        value: 'basic',
    },
    {
        id: 'premium',
        label: 'Premium',
        description: 'Monthly Sub',
        value: 'premium',
    },
]

export default function SignUp() {
    const { signUp } = useUser()
    return (
        <>
            <Form<I_AetherscribeSignup>
                initialValue={formDataInit}
                buttonText="Create"
                linkText="Already have an account?"
                link={{
                    href: '/login',
                    id: 'login',
                    label: 'Login',
                }}
                onSubmit={signUp}
                fields={[
                    {
                        fieldName: 'firstName',
                        id: 'firstName',
                        inputType: 'text',
                        label: 'First Name',
                        placeholder: 'Kolgart',
                    },
                    {
                        fieldName: 'lastName',
                        id: 'lastName',
                        inputType: 'text',
                        label: 'Last Name',
                        placeholder: 'Broadmaster Valenthi',
                    },
                    {
                        fieldName: 'dateOfBirth',
                        id: 'dateOfBirth',
                        inputType: 'text',
                        label: 'Date of Birth',
                        placeholder: '01/01/1990',
                    },
                    {
                        fieldName: 'nationality',
                        id: 'nationality',
                        inputType: 'text',
                        label: 'Nationality',
                        placeholder: 'Avandrian',
                    },
                    {
                        fieldName: 'email',
                        id: 'email',
                        inputType: 'email',
                        label: 'Email',
                        placeholder: 'imnotacabbage@mail.com',
                    },
                    {
                        fieldName: 'username',
                        id: 'username',
                        inputType: 'text',
                        label: 'Username',
                        placeholder: 'KolgartArgh!',
                    },
                    {
                        fieldName: 'password',
                        id: 'password',
                        inputType: 'password',
                        label: 'Password',
                        placeholder: '********',
                    },
                    {
                        fieldName: 'passwordConfirm',
                        id: 'passwordConfirm',
                        inputType: 'password',
                        label: 'Password Confirm',
                        placeholder: '*********',
                    },
                ]}
                formTitle="Create Account"
            />
        </>
    )
}
