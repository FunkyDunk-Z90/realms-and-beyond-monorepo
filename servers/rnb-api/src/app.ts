import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import identityAuthRouter from './routes/identityAuthRoutes'
import userRouter from './routes/userRoutes'
import rnbClassRouter from './routes/rnbClassRoutes'

const app = express()

app.use(morgan('dev'))

app.use(
    cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
)

app.use(express.json({ limit: '100mb' }))
app.use(cookieParser())

app.use('/api/v1/user', identityAuthRouter)
// app.use('/api/v1/users', userRouter)
app.use('/api/v1/rnb-class', rnbClassRouter)

export default app
