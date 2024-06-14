import express, { type Express } from 'express'
import routes from './routes'

export const app: Express = express()
app.use(express.json())
app.use(routes)
