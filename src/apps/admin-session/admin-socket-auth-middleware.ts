import { Socket, ExtendedError } from "socket.io";
import { prisma } from 'src/db'


export default async function(socket: Socket, next: (err?: ExtendedError) => void) {
    try {
        let userId: number|null = Number(socket.handshake.query.id) ?? null
        let platform: string|null = socket.handshake.query.platform?.toString() ?? null
        let token: string|null = socket.handshake.query.token?.toString() ?? null

        
        if (!userId || !platform) 
            return next(new Error("Не верные данные для подключения"))


        let userData: any = null

        switch (platform) 
        {
            case 'etexpress':
                let res = await fetch(`https://testdevback.etexpress.ru/api/socket/adminCheckUser?token=${token}&id=${userId}`, {method: 'GET'})

                if (!res.ok) {
                    return next(new Error("Неавторизованный пользователь"));
                }

                let resJson = await res.json()

                userData = {
                    outerId: resJson.id,
                    platform: platform,
                    name: resJson.name + ' ' + resJson.last_name
                }                    
                break;
        
            default:
                return next(new Error("Неподдерживаемая платформа"))
        }
            

        let user = await prisma.user.findFirst({ 
            where: { 
                outerId: userId,
                platform: platform
            } 
        })

        if (userData) {
            if (user) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { name: userData.name }
                })
            }
            else {
                await prisma.user.create({
                    data: { 
                        platform: platform,
                        outerId: userId,
                        name: userData.name
                    }
                })
            }
        }
        else {
            return next(new Error("Не авторизованный пользователь"))
        }

        
        socket.data = { user }
        
        return next()
    } 
    catch (e) {
        return next(new Error(e?.toString()))
    }
}