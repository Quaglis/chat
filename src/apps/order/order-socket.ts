import { Namespace } from "socket.io"
import { io } from 'src/app'
import orderSocketAuthMiddleware from "./order-socket-auth-middleware"


interface OrderClientToServerEvents {}

interface OrderServerToClientEvents {
    error: (message: string) => void
    change_status: (arg: { status: string }) => void
}

interface OrderInterServerEvents {}

interface OrderSocketData {
    orderId: number
}


export const orderNamespace: Namespace<
    OrderClientToServerEvents, 
    OrderServerToClientEvents, 
    OrderInterServerEvents, 
    OrderSocketData
> = io.of("/order")


export default function() {
    orderNamespace
        .use(orderSocketAuthMiddleware)
        .on("connection", async (socket) => {
            socket.join(`order-${socket.data.orderId}`)
        })
}