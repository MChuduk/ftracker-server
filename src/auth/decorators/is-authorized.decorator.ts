import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

export const IsAuthorized = createParamDecorator(
  (_: undefined, context: ExecutionContext): boolean => {
    const ctx = GqlExecutionContext.create(context);
    const req: Request = ctx.getContext().req;
    const accessToken: string = req?.cookies?.Authentication;
    const refreshToken: string = req?.cookies?.Refresh;

    if (accessToken && refreshToken) return true;

    return false;
  },
);
