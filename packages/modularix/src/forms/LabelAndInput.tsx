type T_InputType = 'text' | 'number' | 'password' | 'email'

interface I_LabelAndInputProps {
    label: string
    htmlFor: string
    inputId: string
    inputType: T_InputType
    placeholder: string
    value?: string | number
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function LabelAndInput({
    label,
    inputId,
    htmlFor,
    inputType,
    placeholder,
    value,
    onChange,
}: I_LabelAndInputProps) {
    return (
        <div className="label-and-input-container">
            <label className="form-label" htmlFor={htmlFor}>
                {label}
            </label>
            <input
                className="form-input"
                type={inputType}
                id={inputId}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}
