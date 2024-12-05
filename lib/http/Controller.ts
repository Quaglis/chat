// import {get} from 'lib/http/methods'


export class Controller
{
    // private routs: object[] = [];

    @get('/test')
    test() 
    {
        
    }
}

function get(path: string|null, _middleware: any = null)
{
    
    return function(_original: any, context: ClassMethodDecoratorContext, a: any) 
    {
        let name = path ?? context.name

        
        console.log()

        console.log(_original.name)
        console.log(context)
        console.log('GET: ', name)
    }
}
