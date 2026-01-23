import { SignUpForm } from '@rnb/modularix'

export default function SignUp() {
    return (
        <div className="page-wrapper">
            <SignUpForm signupApiUrl="http://localhost:5674/api/v1/user/sign-up" />
        </div>
    )
}
