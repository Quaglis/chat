import { Request, Response } from 'express'
import { app } from "src/app"
import { orderNamespace } from './order-socket'


export default () => {
    app.get('/app/order/change-status/:id/:status', (req: Request, res: Response) => {

        orderNamespace.in(`order-${req.params.id}`).emit("change_status", { 
            status: req.params.status 
        })

        res.sendStatus(200)
    })
}