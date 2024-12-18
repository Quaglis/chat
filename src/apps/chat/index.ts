import { chatNamespace } from 'src/apps/chat/chat-socket'
import { authMiddleware } from 'lib/socket/middlewares'


export default () => {
    chatNamespace.use(authMiddleware)
}