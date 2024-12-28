import { Namespace } from "socket.io"
import { io } from 'src/app'
import orderSocketAuthMiddleware from "./admin-socket-auth-middleware"
import { User } from "@prisma/client"


interface AdminSessionClientToServerEvents {
    join_session: (arg: { path: string }) => void
    leave_session: () => void
}

interface AdminSessionServerToClientEvents {
    error: (arg: {message: string}) => void
    session: (user: User) => void
}

interface AdminSessionInterServerEvents {}

interface AdminSessionSocketData {
    user: User,
    path: string|null
}


export const adminSessionNamespace: Namespace<
    AdminSessionClientToServerEvents, 
    AdminSessionServerToClientEvents, 
    AdminSessionInterServerEvents, 
    AdminSessionSocketData
> = io.of("/admin-session")


export default function() {
    adminSessionNamespace
        .use(orderSocketAuthMiddleware)
        .on("connection", async (socket) => {

            socket.on("join_session", async ({path}) => {
                await socket.join(path)

                let sockets = await adminSessionNamespace.in(path).fetchSockets()

                let session = sockets.find(item => item.data.path === path)

                if (session) {
                    socket.emit("session", session.data.user)
                }
                else {
                    socket.data.path = path
                    adminSessionNamespace.in(path).emit("session", socket.data.user)
                }
            })
            
            socket.on("leave_session", async () => {
                let path = socket.data.path
                
                if (path) {
                    await socket.leave(path)

                    socket.data.path = null

                    let sockets = await adminSessionNamespace.in(path).fetchSockets()

                    if (sockets.length) {
                        adminSessionNamespace.in(path).emit("session", sockets[0].data.user)

                        sockets[0].data.path = path
                    }
                }
            })

            socket.on("disconnect", async () => {
                let path = socket.data.path

                if (path) {
                    let sockets = await adminSessionNamespace.in(path).fetchSockets()

                    if (sockets.length) {
                        adminSessionNamespace.in(path).emit("session", sockets[0].data.user)

                        sockets[0].data.path = path
                    }
                }
            })

        })
}