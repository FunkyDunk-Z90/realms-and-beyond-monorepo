'use client'

import { useState } from 'react'
import { useUser } from '@/lib/context/UserContext'
import { Form } from '@rnb/modularix'
import { I_AetherscribeSignup } from '@rnb/types'

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

export default function SignUp() {
    const { signUp } = useUser()
    const [tabIndex, setTabIndex] = useState(1)
    const [formData, setFormData] = useState<I_AetherscribeSignup>(formDataInit)
    const maxTabIndex = 2

    const increaseIndex = () => {
        if (tabIndex < maxTabIndex) {
            setTabIndex((prev) => prev + 1)
        }
    }

    const decreaseIndex = () => {
        if (tabIndex > 1) {
            setTabIndex((prev) => prev - 1)
        }
    }

    // Update form data as user progresses
    const handleStepSubmit = (values: I_AetherscribeSignup) => {
        setFormData((prev) => ({ ...prev, ...values }))

        if (tabIndex === maxTabIndex) {
            // Final submission
            signUp({ ...formData, ...values })
        } else {
            // Move to next step
            increaseIndex()
        }
    }

    // Define fields for each step
    const getFieldsForStep = () => {
        switch (tabIndex) {
            case 1:
                return [
                    {
                        fieldName: 'firstName' as const,
                        id: 'firstName',
                        inputType: 'text' as const,
                        label: 'First Name',
                        placeholder: 'Kolgart',
                    },
                    {
                        fieldName: 'lastName' as const,
                        id: 'lastName',
                        inputType: 'text' as const,
                        label: 'Last Name',
                        placeholder: 'Broadmaster Valenthi',
                    },
                    {
                        fieldName: 'dateOfBirth' as const,
                        id: 'dateOfBirth',
                        inputType: 'text' as const,
                        label: 'Date of Birth',
                        placeholder: 'MM/DD/YYYY',
                    },
                    {
                        fieldName: 'nationality' as const,
                        id: 'nationality',
                        inputType: 'text' as const,
                        label: 'Nationality',
                        placeholder: 'Avandrian',
                    },
                    {
                        fieldName: 'email' as const,
                        id: 'email',
                        inputType: 'email' as const,
                        label: 'Email',
                        placeholder: 'imnotacabbage@mail.com',
                    },
                ]
            case 2:
                return [
                    {
                        fieldName: 'username' as const,
                        id: 'username',
                        inputType: 'text' as const,
                        label: 'Username',
                        placeholder: 'KolgartArgh!',
                    },
                    {
                        fieldName: 'password' as const,
                        id: 'password',
                        inputType: 'password' as const,
                        label: 'Password',
                        placeholder: '********',
                    },
                    {
                        fieldName: 'passwordConfirm' as const,
                        id: 'passwordConfirm',
                        inputType: 'password' as const,
                        label: 'Confirm Password',
                        placeholder: '********',
                    },
                ]
            default:
                return []
        }
    }

    const getStepTitle = () => {
        switch (tabIndex) {
            case 1:
                return 'Personal Information'
            case 2:
                return 'Account Security'
            default:
                return 'Create Account'
        }
    }

    return (
        <div className="signup-wrapper">
            <Form<I_AetherscribeSignup>
                initialValue={formData}
                buttonText={
                    tabIndex === maxTabIndex ? 'Create Account' : 'Continue →'
                }
                linkText={
                    tabIndex === 1 ? 'Already have an account?' : undefined
                }
                link={
                    tabIndex === 1
                        ? {
                              href: '/login',
                              id: 'login',
                              label: 'Login',
                          }
                        : undefined
                }
                onSubmit={handleStepSubmit}
                fields={getFieldsForStep()}
                formTitle={getStepTitle()}
                stepNavigation={{
                    currentStep: tabIndex,
                    totalSteps: maxTabIndex,
                    onBack: decreaseIndex,
                    onNext: increaseIndex,
                }}
            />
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi
                quae veniam expedita soluta sit, necessitatibus nesciunt dolorem
                ab inventore. Explicabo blanditiis numquam sed nobis iure atque
                vitae saepe earum consequatur placeat quaerat adipisci sapiente
                aspernatur dolore, aut, voluptate vel beatae sunt delectus. Quam
                vel nemo, in odit officia quas mollitia, culpa excepturi
                assumenda repudiandae tenetur atque. Veritatis recusandae natus
                consequatur iure quia? Totam in at, sed cupiditate quia eius
                debitis obcaecati sunt quam voluptatibus nam ad eaque excepturi
                eligendi, natus distinctio tempore exercitationem dolores cumque
                sapiente assumenda quos temporibus dicta non? Nihil et deleniti
                aliquam hic excepturi officia ipsam voluptate ullam, quaerat
                perferendis amet nobis architecto, quas facilis ipsa rerum
                corporis numquam ad soluta quisquam? Eius mollitia porro,
                corrupti dicta voluptates fugit adipisci amet odit nulla
                inventore cum nihil veniam quaerat quasi laboriosam? Iure,
                aliquid in quam quos accusantium dignissimos similique sed
                maiores eum numquam deserunt delectus beatae architecto ad nemo
                expedita, non temporibus reprehenderit error eius eaque soluta?
                Placeat enim minima, fuga atque temporibus totam corporis unde
                est deserunt facere animi deleniti libero sit veniam nesciunt
                numquam vitae, accusamus cupiditate. Vero delectus ullam
                explicabo voluptate voluptatem quaerat itaque quo fugiat
                officia. Numquam, dolore adipisci alias illum perferendis
                exercitationem itaque.
            </p>
        </div>
    )
}
