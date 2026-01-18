import { Request } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../utils/validateEnv'

export const createToken = (_id: string) => {
    return jwt.sign({ _id }, env.JWT_SECRET, { expiresIn: '90d' })
}

export const extractToken = (req: Request): string | undefined => {
    const { jwt } = req.cookies
    const { authorization } = req.headers

    let token: string | undefined

    if (jwt) {
        token = jwt
    } else if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1]
    }

    return token
}
