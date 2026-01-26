'use client'

import { Form } from '@rnb/modularix'
import { useUser } from '@/lib/context/UserContext'
import { I_LoginEmailType } from '@rnb/types'

const loginInit: I_LoginEmailType = {
    email: '',
    password: '',
}

export default function LoginPage() {
    const { login } = useUser()

    return (
        <Form<I_LoginEmailType>
            initialValue={loginInit}
            fields={[
                {
                    fieldName: 'email',
                    id: 'email',
                    inputType: 'email',
                    label: 'Email',
                    placeholder: 'mail@mail.com',
                },
                {
                    fieldName: 'password',
                    id: 'password',
                    inputType: 'password',
                    label: 'Password',
                    placeholder: '*********',
                },
            ]}
            onSubmit={login}
            buttonText="Login"
            link={{
                href: '/signup',
                id: 'signup',
                label: 'Signup',
            }}
            linkText={`Don't have an account?`}
            formTitle="Login"
        />
    )
}
