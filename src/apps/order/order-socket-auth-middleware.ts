import { Socket, ExtendedError } from "socket.io";
import { prisma } from 'src/db'


export default async function(socket: Socket, next: (err?: ExtendedError) => void) {

    let userId: number|null = Number(socket.handshake.query.id) ?? null
    let platform: string|null = socket.handshake.query.platform?.toString() ?? null
    let orderId: number|null = Number(socket.handshake.query.orderId) ?? null
    
    if (!userId || !platform || !orderId) 
        return next(new Error("Не верные данные для подключения"))

    let user = await prisma.user.findFirst({ 
        where: { 
            outerId: userId,
            platform: platform
        } 
    })

    if (!user) 
        return next(new Error("Не авторизованный пользователь"))

    
    socket.data = { orderId }
    
    next()
}