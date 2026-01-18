import 'dotenv/config'
import { connect } from 'mongoose'
import { env } from './utils/validateEnv'
import app from './app'

const database = env.DATABASE.replace('<PASSWORD>', env.DATABASE_PASSWORD)

const connectToDatabase = async function () {
    try {
        await connect(database)
        console.log('Connected to Database')
    } catch (error) {
        console.error(error)
        console.log("Couldn't connect to database")
    }
}

const port = env.PORT

const startServer = async function () {
    try {
        await connectToDatabase()

        app.listen(port, () => {
            console.log(`App running on port ${port}`)
        })
    } catch (error) {
        console.error(error)
        console.log("Couldn't connect to server")
    }
}

startServer()
