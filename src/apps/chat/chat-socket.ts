import { Namespace} from "socket.io"
import { Chat, Message, User } from "@prisma/client"
import { io } from 'src/app'
import chatService from './chat-service'
import chatSocketAuthMiddleware from "./chat-socket-auth-middleware"


interface ChatClientToServerEvents {
    create_chat: (arg: { name: string, members: {id: number, platform: string}[] }) => void
    remove_chat: (arg: { chatId: number }) => void

    messages: (arg: { chatId: number }) => void
    send_message: (arg: { chatId: number, text: string }) => void
    read_messages: (arg: { messages: number[] }) => void
    remove_message: (arg: { messageId: number}) => void
}

interface ChatServerToClientEvents {
    error: (message: string) => void

    chats: (chats: Chat[]) => void
    emit_chat: (chat: Chat) => void
    remove_chat: (chatId: Chat) => void

    messages: (messages: Message[]) => void
    emit_message: (message: Message) => void
    read_messages: (messages: Message[]) => void
    remove_message: (messageId: Message) => void
}

interface ChatInterServerEvents {}

interface ChatSocketData {
    user: User
}


export const chatNamespace: Namespace<
    ChatClientToServerEvents, 
    ChatServerToClientEvents, 
    ChatInterServerEvents, 
    ChatSocketData
> = io.of("/chat")


export default function() {
    chatNamespace
        .use(chatSocketAuthMiddleware)
        .on("connection", async (socket) => {

            socket.on("create_chat", async ({name, members}) => {
                try {
                    let chat = await chatService.createChat(name, members)
                    let sockets = await chatNamespace.fetchSockets()
                    let memberIds = chat.members.map(member => member.user.id)

                    sockets
                        .filter(socket => memberIds.includes(socket.data.user.id))
                        .forEach(socket => socket.join(`chat-${chat.id}`))
                    
                    chatNamespace.in(`chat-${chat.id}`).emit('emit_chat', chat)
                }
                catch (error) {
                    console.error(error)
                    socket.emit("error", (error as Error).message)
                }
            })


            socket.on("remove_chat", async ({chatId}) => {
                try {
                    let chat = await chatService.removeChat(chatId)

                    chatNamespace.in(`chat-${chat.id}`).emit('remove_chat', chat)

                    chatNamespace.socketsLeave(`chat-${chat.id}`)
                }
                catch (error) {
                    console.error(error)
                    socket.emit("error", (error as Error).message)
                }
            })
            

            socket.on("messages", async ({ chatId }) => {
                try {
                    let messages = await chatService.getMessages(chatId)

                    socket.emit("messages", messages)
                }
                catch (error) {
                    console.error(error)
                    socket.emit("error", (error as Error).message)
                }
            })
            

            socket.on("send_message", async ({ chatId, text }) => {
                try {
                    let message = await chatService.createMessage(chatId, socket.data.user.id, text)

                    chatNamespace.in(`chat-${message.chatId}`).emit("emit_message", message)
                }
                catch (error) {
                    console.error(error)
                    socket.emit("error", (error as Error).message)
                }
            })


            socket.on("read_messages", async ({ messages }) => {
                try {
                    let groups = await chatService.readMessages(messages, socket.data.user.id)
                    
                    for (const chatId in groups) {                        
                        chatNamespace.in(`chat-${chatId}`).emit("read_messages", groups[chatId])
                    }
                }
                catch (error) {
                    console.error(error)
                    socket.emit("error", (error as Error).message)
                }
            })


            socket.on("remove_message", async ({ messageId }) => {
                try {
                    let message = await chatService.removeMessage(messageId)

                    chatNamespace.in(`chat-${message.chatId}`).emit("remove_message", message)
                }
                catch (error) {
                    console.error(error)
                    socket.emit("error", (error as Error).message)
                }
            })

            
            let chats = await chatService.getChats(socket.data.user.id)

            chats.forEach(chat => socket.join(`chat-${chat.id}`))


            socket.emit('chats', chats)
        })
}
