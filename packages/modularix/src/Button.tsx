import type { I_ButtonProps } from '@rnb/types'

export const Button = ({
    children,
    handleClick,
    isDisabled,
    theme,
    btnType,
    withRef,
}: I_ButtonProps) => {
    const btnTheme = !theme ? '' : theme
    const defaultBtnType = !btnType ? 'button' : btnType
    return (
        <button
            suppressHydrationWarning
            onClick={handleClick}
            disabled={isDisabled}
            className={`btn ${btnTheme}`}
            type={defaultBtnType}
            ref={withRef}
            role="button"
        >
            {children}
        </button>
    )
}
