

export function get(path: string|null, _middleware: any)
{
    return function(_original: any, context: ClassMethodDecoratorContext) 
    {
        let name = path ?? context.name

        console.log('GET: ', name)
    }
}

export function post(path: string|null, _middleware: any)
{
    return function(_original: any, context: ClassMethodDecoratorContext) 
    {
        let name = path ?? context.name

        console.log('POST: ', name)
    }
}