import { Namespace } from "socket.io";
import { io } from 'src/app'



interface ChatClientToServerEvents {
    send_message: (arg: string) => void
}

interface ChatServerToClientEvents {
    emit_message: (arg: string) => void
}

interface ChatInterServerEvents {}

interface ChatSocketData {}



export const chatNamespace: Namespace<
    ChatClientToServerEvents, 
    ChatServerToClientEvents, 
    ChatInterServerEvents, 
    ChatSocketData
> = io.of("/chat")


chatNamespace
    .on("connection", (socket) => {
        console.log('connect')
        
        socket.on("send_message", (msg: string) => {
            console.log("нихуя!", msg)
        })
    
        
        socket.emit("emit_message", "123")
    })
