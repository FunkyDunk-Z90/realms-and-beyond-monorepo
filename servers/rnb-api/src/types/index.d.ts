import { iUser, iUserDoc } from '../models/userModel'

declare global {
    namespace Express {
        export interface Request {
            user?: string | iUserDoc | iUser
        }
    }
}

export {}
