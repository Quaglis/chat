import http from 'http'
import express from 'express'
import dotenv from 'dotenv'
import { Server } from 'socket.io'



dotenv.config()
const port = process.env.PORT ?? 8080
const host = process.env.HOST ?? 'localhost'
const scheme = process.env.SCHEME ?? 'http'



export const app = express()


export const server = http.createServer(app)


export const io = new Server(server, {
    cors: {
        origin: "*"
    }
})


export function run() {
    server.listen(port, () => {
        console.log(`[server]: ${scheme}://${host}:${port}`)
    })
}
