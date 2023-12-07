import { UseInterceptors, applyDecorators } from '@nestjs/common';
import {
    DebuggerHttpInterceptor,
    DebuggerHttpResponseInterceptor,
    DebuggerHttpWriteIntoConsoleInterceptor,
    DebuggerHttpWriteIntoFileInterceptor,
} from '../interceptors/debugger.interceptor';

// Default DebuggerMiddlewareModule apply http debuggers middleware for all routes,  {etc.forRoutes('*');}
// only use @ApplyHttpDebuggers() decorator when the DebuggerMiddlewareModule was not apply your routes, otherwise the debugger will be duplicated
// all the interceptors bellow is working the same as the middlewares in DebuggerMiddlewareModule
export function ApplyHttpDebuggers(): ClassDecorator {
    return applyDecorators(
        UseInterceptors(DebuggerHttpResponseInterceptor),
        UseInterceptors(DebuggerHttpInterceptor),
        UseInterceptors(DebuggerHttpWriteIntoConsoleInterceptor),
        UseInterceptors(DebuggerHttpWriteIntoFileInterceptor),
    );
}
