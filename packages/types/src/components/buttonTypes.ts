import type { T_BtnRef, T_ButtonEvent } from '../reactTypes'

type T_BtnTypes = 'button' | 'reset' | 'submit' | undefined
type T_BtnTheme =
    | 'accent'
    | 'warning'
    | 'danger'
    | 'submit'
    | 'success'
    | 'disabled'
    | undefined

export interface I_ButtonProps {
    children: React.ReactNode
    handleClick: (e?: T_ButtonEvent | undefined) => void
    isDisabled?: boolean
    theme?: T_BtnTheme
    btnType?: T_BtnTypes
    withRef?: T_BtnRef
}
