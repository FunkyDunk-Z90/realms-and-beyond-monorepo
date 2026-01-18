import type { ReactNode, RefObject, MouseEvent, ChangeEvent } from 'react'

export interface I_BaseProps {
    children?: ReactNode
    className?: string
}

export type T_WithChildren<T = {}> = T & { children?: ReactNode }

export type T_BtnRef = RefObject<HTMLButtonElement>

export type T_ButtonEvent =
    | MouseEvent<HTMLButtonElement>
    | ChangeEvent<HTMLButtonElement>
