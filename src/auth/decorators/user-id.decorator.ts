import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import AccessTokenPayload from '../model/access-token-payload';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

export const UserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const ctx = GqlExecutionContext.create(context);
    const request: Request = ctx.getContext().req;
    const user = request.user as AccessTokenPayload;
    return user.userId;
  },
);
