// src/env.ts
import { cleanEnv, str } from 'envalid'

export const env = cleanEnv(process.env, {
    RNB_LOCALHOST: str(),
})
