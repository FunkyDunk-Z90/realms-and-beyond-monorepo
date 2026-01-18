// src/env.ts
import { cleanEnv, str, port } from 'envalid'

export const env = cleanEnv(process.env, {
    PORT: port({ default: 8000 }),
    DATABASE: str(),
    DATABASE_PASSWORD: str(),
    JWT_SECRET: str(),
    JWT_COOKIE_SECRET: str(),
    JWT_EXPIRES_IN: str(),
    JWT_COOKIE_EXPIRES_IN: str(),
    CLOUDINARY_NAME: str(),
    CLOUDINARY_API_KEY: str(),
    CLOUDINARY_SECRET: str(),
    CLOUDINARY_URL: str(),
    USER_DEFAULT_AVATAR: str(),
    MAILTRAP_HOST: str(),
    MAILTRAP_PORT: str(),
    MAILTRAP_USERNAME: str(),
    MAILTRAP_PASSWORD: str(),
})
