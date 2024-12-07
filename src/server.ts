import controllers from 'src/router'
import { Express } from 'express'


export default {
    run: function(app: Express) {
        
        const port = process.env.PORT ?? 8080
        const host = process.env.HOST ?? 'localhost'
        const scheme = process.env.SCHEME ?? 'http'


        for (const controller of controllers) {
            (new controller()).register(app)
        }


        app.listen(port, () => {
            console.log(`[server]: Server is running at ${scheme}://${host}:${port}`)
        })
    }
}