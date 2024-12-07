
import {Middleware} from './Middleware'
import {Controller} from './Controller'

export type {Middleware}
export {Controller}


export const route = Controller.route

export const middlewares = Controller.middlewares
export const middleware = (middleware: Middleware) => Controller.middlewares([middleware])

export const method = Controller.method
export const get = (path: string|null = null, middlewares: Middleware[]|null = null) => Controller.method('get', path, middlewares)
export const post = (path: string|null = null, middlewares: Middleware[]|null = null) => Controller.method('post', path, middlewares)
export const put = (path: string|null = null, middlewares: Middleware[]|null = null) => Controller.method('put', path, middlewares)
export const patch = (path: string|null = null, middlewares: Middleware[]|null = null) => Controller.method('patch', path, middlewares)
export const options = (path: string|null = null, middlewares: Middleware[]|null = null) => Controller.method('options', path, middlewares)

