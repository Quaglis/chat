import { Middleware } from './Middleware'
import { Request, Response, Router, Express } from 'express'


export abstract class Controller {
    /**
     * Статичный массив для регистрации контроллеров.
     */
    private static controllers: MetaController[] = []


    /*** Private methods ***/

    /**
     * Возвращает объект метаданных контроллера.
     */
    private static getController(name: string): MetaController 
    {
        let controller = Controller.controllers.find(item => item.name === name)

        if (!controller) {
            controller = {
                name: name,
                path: '/',
                routes: [],
                middlewares: []
            }

            this.controllers.push(controller)
        }

        return controller
    }

    /**
     * Возвращает объект метаданных роута.
     */
    private static getRoute(controllerName: string, routeName: string) 
    {
        let controller = this.getController(controllerName)

        let route = controller.routes.find(item => item.name === routeName)

        if (!route) {
            route = {
                name: routeName,
                path: routeName,
                method: 'get',
                action: null,
                middlewares: []
            }

            controller.routes.push(route)
        }

        return route
    }
    
    /**
     * Устанавливает значения объект метаданных роута.
     */
    private static setRoute(
        controllerName: string,
        routeName: string,
        method: string|null = null,
        path: string|null = null,
        action: Action|null = null,
        middlewares: Middleware[]|null = null
    ): void 
    {
        let route = this.getRoute(controllerName, routeName)

        if (method) route.method = method
        if (path) route.path = path
        if (action) route.action = action
        if (middlewares) route.middlewares = middlewares
    }

    
    /*** Public methods ***/

    /**
     * Регистрация контроллера.
     */
    public register(app: Express)
    {
        let router = Router()

        let controller = Controller.getController(this.constructor.name)


        for (const middleware of controller.middlewares) {
            router.use(middleware.handle) 
        }


        for (const route of controller.routes) {
            router[route.method](route.path, route.action)
        }

        app.use(controller.path, router)
    }


    /**
     * Базовый декоратор route для метода или класс.
     */
    public static route(path: string) 
    {
        return function (target, key: any = undefined) {           
            if (typeof target === typeof Controller) {
                Controller
                    .getController(target.name)
                    .path = path
            }
            else {
                Controller
                    .getRoute(target.constructor.name, key)
                    .path = path
            }           
        }
    }
    
    /**
     * Базовый декоратор middlewares для метода или класс.
     */
    public static middlewares(middlewares: Middleware[])
    {
        return function (target, key: any = undefined) {           
            if (typeof target === typeof Controller) {
                Controller
                    .getController(target.name)
                    .middlewares
                    .push(...middlewares)
            }
            else {
                Controller
                    .getRoute(target.constructor.name, key)
                    .middlewares
                    .push(...middlewares)
            }           
        }
    }

    /**
     * Базовый декоратор, добавляющий метод в роуты
     */
    public static method(
        method: string = 'get', 
        path: string|null = null, 
        middlewares: Middleware[]|null = null
    )
    {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            Controller.setRoute(
                target.constructor.name, 
                propertyKey, 
                method, 
                path ?? propertyKey,
                descriptor.value,
                middlewares
            )
        }
    }
}

/**
 * Метаданные для создания роута.
 */
type MetaRoute = {
    name: string,
    path: string,
    method: string,
    action: Action|null,
    middlewares: Middleware[]
}

/**
 * Метаданные для создания контроллера.
 */
type MetaController = {
    name: string,
    path: string,
    routes: MetaRoute[],
    middlewares: Middleware[]
}

type Action = (request: Request, response: Response) => void