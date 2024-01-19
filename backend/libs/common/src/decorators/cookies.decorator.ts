import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Cookies = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return key ? request.cookies[key] : request.cookies;
  },
);
