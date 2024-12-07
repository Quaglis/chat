import { Controller, method, get, route } from 'lib/http'
import { Request, Response } from 'express'

@route('/testo')
export class TestoController extends Controller 
{
    @method('put', 'testo') 
    fabric(_req: Request) 
    {
        return 'testo'
    }

    @get('/fuck') 
    fuck(_req: Request, res: Response)
    {
        res.send('fuck')
    }
}