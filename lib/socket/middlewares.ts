import { Socket, ExtendedError } from 'socket.io'


export function authMiddleware(socket: Socket, next: (err?: ExtendedError) => void) {
    console.log('auth socket: ' + socket.id)

    next()    
}


