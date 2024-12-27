import { Message } from '@prisma/client'
import { prisma } from 'src/db'


export default class chatService 
{
    static async getChats(userId: number) 
    {
        return await prisma.chat.findMany({
            where: {
                members: {
                    some: { userId }
                }
            },
            include: {
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1
                },
                members: {
                    select: {
                        readOnly: true,
                        user: true
                    }
                }
            }
        })
    }
    

    static async createChat(name: string, members: {id: number, platform: string}[])
    {
        let users = await prisma.user.findMany({
            where: {
                outerId: { in: members.map(item => item.id) }
            }
        })

        users = users.filter(user => !!members.find(item => item.id === user.outerId && item.platform === user.platform))

        let chat = await prisma.chat.create({
            data: {
                name,
                members: {
                    createMany: { 
                        data: users.map(user => ({ userId: user.id }))
                    }
                }
            },
            include: {
                members: {
                    select: {
                        readOnly: true,
                        user: true
                    }
                }
            }
        })

        return chat
    }


    static async removeChat(chatId: number) 
    {
        return await prisma.chat.delete({ 
            where: {id: chatId} 
        })
    }


    static async getMessages(chatId: number) 
    {
        return await prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: "desc" }
        })
    }


    static async createMessage(chatId: number, userId: number, text: string) 
    {   
        let member = await prisma.member.findFirst({ 
            where: { 
                chatId,
                userId
            },
        })

        if (!member) 
            throw new Error("Пользователь не состоит в чате")

        return await prisma.message.create({
            data: { 
                text,
                chatId,
                userId,
            }
        })
    }


    static async readMessages(messages: number[], userId: number)
    {
        await prisma.message.updateMany({
            where: {
                id: { in: messages },
                userId: { not: userId }
            },
            data: {
                readed: true
            }
        })
        
        let msgs = await prisma.message.findMany({
            where: { 
                id: { in: messages },
                userId: { not: userId }
            }
        })

        return msgs.reduce((groups: object, item: Message) => {
            if (!groups[item.chatId]) 
                groups[item.chatId] = []
            
            groups[item.chatId].push(item)

            return groups
        }, {})
    }


    static async removeMessage(messageId: number)
    {
        return await prisma.message.delete({ 
            where: {id: messageId} 
        })
    }

   
}

