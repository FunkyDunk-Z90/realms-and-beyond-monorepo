'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import { Button } from '../ui/Button'
import { I_DropdownOption, I_Link } from '@rnb/types'

interface I_FieldConfig<T> {
    fieldName: keyof T
    label: string
    id: string
    inputType: 'text' | 'number' | 'password' | 'email'
    placeholder: string
    required?: boolean
}

interface I_PasswordRequirements {
    minLength?: number
    requireUppercase?: boolean
    requireLowercase?: boolean
    requireNumber?: boolean
    requireSpecialChar?: boolean
    specialCharPattern?: string
}

interface I_StepNavigation {
    currentStep: number
    totalSteps: number
    onNext?: () => void
    onBack?: () => void
    showBackButton?: boolean
    showNextButton?: boolean
    nextButtonText?: string
    backButtonText?: string
    completedSteps?: number[] // Track which steps have been completed/validated
}

interface I_FormProps<T> {
    initialValue: T
    fields: I_FieldConfig<T>[]
    onSubmit: (value: T) => void
    buttonText: string
    link?: I_Link
    linkText?: string
    formTitle: string
    errorMessage?: string | null
    passwordRequirements?: I_PasswordRequirements
    stepNavigation?: I_StepNavigation
}

const DEFAULT_PASSWORD_REQUIREMENTS: I_PasswordRequirements = {
    minLength: 9,
    requireUppercase: true,
    requireLowercase: false,
    requireNumber: true,
    requireSpecialChar: true,
    specialCharPattern: '[!@#$%^&*(),.?":{}|<>]',
}

export const Form = <T extends Record<string, any>>({
    fields,
    initialValue,
    onSubmit,
    buttonText,
    link,
    linkText,
    formTitle,
    errorMessage,
    passwordRequirements = DEFAULT_PASSWORD_REQUIREMENTS,
    stepNavigation,
}: I_FormProps<T>) => {
    const [values, setValues] = useState<T>(initialValue)
    const [passwordErrors, setPasswordErrors] = useState<string[]>([])
    const [passwordConfirmError, setPasswordConfirmError] = useState<
        string | null
    >(null)
    const [emailError, setEmailError] = useState<string | null>(null)
    const [dateOfBirthError, setDateOfBirthError] = useState<string | null>(
        null
    )

    // Merge custom requirements with defaults
    const requirements = {
        ...DEFAULT_PASSWORD_REQUIREMENTS,
        ...passwordRequirements,
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        onSubmit(values)
    }

    function validatePassword(password: string): string[] {
        const errors: string[] = []
        const {
            minLength,
            requireLowercase,
            requireNumber,
            requireSpecialChar,
            requireUppercase,
            specialCharPattern,
        } = requirements

        if (minLength && password.length < minLength) {
            errors.push(`Must be at least ${minLength} characters long.`)
        }

        if (requireUppercase && !/[A-Z]/.test(password)) {
            errors.push('Must contain at least one uppercase letter.')
        }

        if (requireLowercase && !/[a-z]/.test(password)) {
            errors.push('Must contain at least one lowercase letter.')
        }

        if (requireNumber && !/[0-9]/.test(password)) {
            errors.push('Must contain at least one number.')
        }

        if (requireSpecialChar && specialCharPattern) {
            const regex = new RegExp(specialCharPattern)
            if (!regex.test(password)) {
                errors.push('Must contain at least one special character.')
            }
        }

        return errors
    }

    function formatDate(value: string): string {
        const digits = value.replace(/\D/g, '').slice(0, 8)

        if (digits.length <= 2) {
            return digits
        }

        if (digits.length <= 4) {
            return `${digits.slice(0, 2)}/${digits.slice(2)}`
        }

        return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target

        setValues((prev) => {
            // Handle date formatting for dateOfBirth field
            if (id === 'dateOfBirth') {
                const formatted = formatDate(value)
                setDateOfBirthError(validateDateOfBirth(formatted))
                return { ...prev, [id]: formatted }
            }

            const updated = { ...prev, [id]: value }

            // Validate password field
            if (id === 'password') {
                const errors = validatePassword(value)
                setPasswordErrors(errors)

                // Also re-check confirmation if it exists
                if ('passwordConfirm' in prev && prev.passwordConfirm) {
                    setPasswordConfirmError(
                        value !== prev.passwordConfirm
                            ? 'Passwords do not match.'
                            : null
                    )
                }
            }

            // Validate password confirmation field
            if (id === 'passwordConfirm') {
                setPasswordConfirmError(
                    'password' in prev && value !== prev.password
                        ? 'Passwords do not match.'
                        : null
                )
            }

            if (id === 'email') {
                setEmailError(validateEmail(value))
            }

            return updated
        })
    }

    // Check if form has password fields
    const hasPasswordField = fields.some((field) => field.id === 'password')
    const hasPasswordConfirmField = fields.some(
        (field) => field.id === 'passwordConfirm'
    )

    // Check if all current fields have values
    const areAllFieldsFilled = (): boolean => {
        return fields.every((field) => {
            const value = values[field.fieldName]
            // Check if value exists and is not empty (handles string, number, etc.)
            return (
                value !== undefined &&
                value !== null &&
                String(value).trim() !== ''
            )
        })
    }

    // Check if current fields are valid (filled + no errors)
    const areCurrentFieldsValid = (): boolean => {
        // First check if all fields are filled
        if (!areAllFieldsFilled()) {
            return false
        }

        // If has password field, check for password errors
        if (hasPasswordField && 'password' in values) {
            const currentPasswordErrors = validatePassword(
                String(values.password || '')
            )
            if (currentPasswordErrors.length > 0) {
                return false
            }
        }

        // If has password confirm field, check if passwords match
        if (
            hasPasswordConfirmField &&
            'password' in values &&
            'passwordConfirm' in values
        ) {
            if (values.password !== values.passwordConfirm) {
                return false
            }
        }

        // Email validation
        if ('email' in values && emailError) {
            return false
        }

        // Date of birth validation
        if ('dateOfBirth' in values && dateOfBirthError) {
            return false
        }

        return true
    }

    // Determine if submit should be disabled
    const isSubmitDisabled = (): boolean => {
        // Check if all fields are filled
        if (!areAllFieldsFilled()) {
            return true
        }

        // If password field exists, check for errors
        if (hasPasswordField) {
            if ('password' in values && passwordErrors.length > 0) {
                return true
            }
        }

        // If password confirm field exists, check for errors
        if (hasPasswordConfirmField && passwordConfirmError) {
            return true
        }

        if (emailError || dateOfBirthError) {
            return true
        }

        return false
    }

    function validateEmail(email: string): string | null {
        // Simple, reliable email regex (HTML5-level strictness)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
            ? null
            : 'Please enter a valid email address.'
    }

    function validateDateOfBirth(value: string): string | null {
        if (value.length !== 10) {
            return 'Date must be in the format DD/MM/YYYY.'
        }

        return null
    }

    // Check if a specific step should show as completed
    const isStepCompleted = (stepNumber: number): boolean => {
        // If completedSteps array is provided, use that
        if (stepNavigation?.completedSteps) {
            return stepNavigation.completedSteps.includes(stepNumber)
        }

        // Otherwise, mark previous steps as completed automatically
        if (stepNavigation) {
            return stepNumber < stepNavigation.currentStep
        }

        return false
    }

    // Determine if we should show the back button
    const shouldShowBackButton =
        stepNavigation?.showBackButton ??
        (stepNavigation && stepNavigation.currentStep > 1)

    // Determine if we should show the next button
    const shouldShowNextButton =
        stepNavigation?.showNextButton ??
        (stepNavigation &&
            stepNavigation.currentStep < stepNavigation.totalSteps)

    // Determine if this is the last step
    const isLastStep = stepNavigation
        ? stepNavigation.currentStep === stepNavigation.totalSteps
        : true

    return (
        <div className="form-wrapper">
            {/* Step Progress Indicator */}
            {stepNavigation && (
                <div className="step-progress">
                    <div className="step-indicator">
                        {Array.from(
                            { length: stepNavigation.totalSteps },
                            (_, i) => (
                                <div
                                    key={i}
                                    className={`step-dot ${
                                        i + 1 === stepNavigation.currentStep
                                            ? 'active'
                                            : isStepCompleted(i + 1)
                                              ? 'completed'
                                              : ''
                                    }`}
                                />
                            )
                        )}
                    </div>
                    <p className="step-text">
                        Step {stepNavigation.currentStep} of{' '}
                        {stepNavigation.totalSteps}
                    </p>
                </div>
            )}

            {/* Navigation Buttons (top of form) */}
            {stepNavigation &&
                (shouldShowBackButton || shouldShowNextButton) && (
                    <div className="form-navigation-top">
                        {shouldShowBackButton && stepNavigation.onBack && (
                            <Button
                                handleClick={stepNavigation.onBack}
                                children={
                                    stepNavigation.backButtonText || '← Back'
                                }
                                btnType="button"
                            />
                        )}
                        {shouldShowNextButton && stepNavigation.onNext && (
                            <Button
                                handleClick={stepNavigation.onNext}
                                children={
                                    stepNavigation.nextButtonText || 'Next →'
                                }
                                btnType="button"
                                isDisabled={!areCurrentFieldsValid()}
                            />
                        )}
                    </div>
                )}

            <form
                className="form-contents"
                onSubmit={handleSubmit}
                suppressHydrationWarning
            >
                <h1 className="form-title">{formTitle}</h1>
                {fields.map((field) => (
                    <div key={field.id} className="form-input-wrapper">
                        <label className="form-label" htmlFor={field.id}>
                            {field.label}
                        </label>
                        <input
                            className={`form-input ${
                                (field.id === 'password' &&
                                    passwordErrors.length > 0) ||
                                (field.id === 'passwordConfirm' &&
                                    passwordConfirmError) ||
                                (field.id === 'email' && emailError) ||
                                (field.id === 'dateOfBirth' && dateOfBirthError)
                                    ? 'warning'
                                    : ''
                            }`}
                            id={field.id}
                            type={field.inputType}
                            value={String(values[field.fieldName] || '')}
                            onChange={handleChange}
                            autoComplete="off"
                            spellCheck="false"
                            placeholder={field.placeholder}
                            required={field.required !== false}
                        />
                        {/* Show password validation errors */}
                        {field.id === 'password' &&
                            passwordErrors.length > 0 && (
                                <ul className="error-wrapper">
                                    {passwordErrors.map((error, index) => (
                                        <li key={index} className="error-text">
                                            {error}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        {/* Show password confirmation error */}
                        {field.id === 'passwordConfirm' &&
                            passwordConfirmError && (
                                <ul className="error-wrapper">
                                    <li className="error-text">
                                        {passwordConfirmError}
                                    </li>
                                </ul>
                            )}
                        {field.id === 'email' && emailError && (
                            <ul className="error-wrapper">
                                <li className="error-text">{emailError}</li>
                            </ul>
                        )}
                        {field.id === 'dateOfBirth' && dateOfBirthError && (
                            <ul className="error-wrapper">
                                <li className="error-text">
                                    {dateOfBirthError}
                                </li>
                            </ul>
                        )}
                    </div>
                ))}
                {errorMessage && <p className="error-text">{errorMessage}</p>}

                {/* Submit Button - Only show on last step (or always if not multi-step) */}
                {isLastStep && (
                    <Button
                        children={buttonText}
                        btnType="submit"
                        isDisabled={isSubmitDisabled()}
                    />
                )}

                {link && (
                    <div className="form-link-wrapper">
                        <p>{linkText}</p>
                        <Link
                            className="form-link"
                            href={link.href}
                            id={link.id}
                        >
                            {link.label}
                        </Link>
                    </div>
                )}
            </form>
        </div>
    )
}
