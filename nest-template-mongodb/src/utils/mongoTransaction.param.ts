import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// export const MongoTransactionParam: () => ParameterDecorator = () => {
//   return createParamDecorator((_data, req) => {
//     console.log('req', req);
//     return req.transaction;
//   });
// };

export const MongoTransactionParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.transaction;
  },
);
