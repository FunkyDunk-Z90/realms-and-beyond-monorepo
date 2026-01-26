'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '../ui/Button'
import { I_Link } from '@rnb/types'

interface I_FieldConfig<T> {
    fieldName: keyof T
    label: string
    id: string
    inputType: 'text' | 'number' | 'password' | 'email'
    placeholder: string
}

interface I_FormProps<T> {
    initialValue: T
    fields: I_FieldConfig<T>[]
    onSubmit: (value: T) => void
    buttonText: string
    link?: I_Link
    linkText?: string
    formTitle: string
}

export const Form = <T,>({
    fields,
    initialValue,
    onSubmit,
    buttonText,
    link,
    linkText,
    formTitle,
}: I_FormProps<T>) => {
    const [values, setValues] = useState<T>(initialValue)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        onSubmit(values)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target

        setValues((prev) => ({
            ...prev,
            [id]: value,
        }))
    }

    return (
        <div className="form-wrapper">
            <h1 className="form-title">{formTitle}</h1>
            <form
                className="form-contents"
                onSubmit={handleSubmit}
                suppressHydrationWarning
            >
                {fields.map((field) => (
                    <div key={field.id} className="form-input-wrapper">
                        <label className="form-label" htmlFor={field.id}>
                            {field.label}
                        </label>
                        <input
                            className="form-input"
                            id={field.id}
                            type={field.inputType}
                            value={String(values[field.fieldName])}
                            onChange={handleChange}
                            autoComplete="off"
                            spellCheck="false"
                            placeholder={field.placeholder}
                        />
                    </div>
                ))}
                <Button children={buttonText} btnType="submit" />
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
