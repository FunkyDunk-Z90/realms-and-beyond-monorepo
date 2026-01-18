import { Response } from 'express'

export const clearCookie = (res: Response, cookieName: string) => {
    res.clearCookie(cookieName, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        expires: new Date(0),
    })
}
