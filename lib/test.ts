
export const one = 1

// function time(originalMethod: any, _context: any) 
// {
//     function replacementMethod(this: any, ...args: any[]) {
//       const now = new Date(Date.now())
//       const result = originalMethod.call(this, ...args)
//       const end = new Date(Date.now())

//       console.log(end.getTime() - now.getTime())
      
//       return result;
//     }
//     return replacementMethod;
// }

// function double(original: any, context: ClassMethodDecoratorContext) 
// {
//     console.log(context, original)

//     return () => original() + original()
// }

// function onConstruct(ans: string) 
// {
//     return function (original, _context: ClassMethodDecoratorContext) 
//     {
//         return function () 
//         { 
//             return original() + ' ' + ans
//         }
//     }
// }
