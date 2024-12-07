import { Request, Response, NextFunction } from 'express';

export interface Middleware 
{
    /**
     * Промежуточный обработчик запросов
     */
    handle(request: Request, response: Response, next: NextFunction): void;
}