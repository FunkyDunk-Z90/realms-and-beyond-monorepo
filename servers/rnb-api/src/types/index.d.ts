import { I_Identity } from '@rnb/types'

declare global {
    namespace Express {
        export interface Request {
            user?: string | I_Identity
        }
    }
}

export {}
