import { SignUpForm } from '@rnb/modularix'

export default function SignUp() {
    return (
        <SignUpForm
            signupApiUrl="http://localhost:5674/api/v1/user/sign-up"
            formTitle="Create your account"
        />
    )
}
