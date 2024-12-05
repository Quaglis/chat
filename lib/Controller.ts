// import {one} from './test';
import {one} from 'lib/test'
console.log(one);

export function get(path: string|null)
{
    return function(_original: any, context: ClassMethodDecoratorContext) 
    {
        let name = path ?? context.name

        console.log('GET: ', name)
    }
}

