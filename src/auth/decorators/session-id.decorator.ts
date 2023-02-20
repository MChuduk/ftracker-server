import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import RefreshTokenPayload from '../interfaces/refresh-token-payload.interface';

export const SessionId = createParamDecorator(
  async (_, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request: Request = ctx.getContext().req;

    const refreshToken: string = request?.cookies?.Refresh;

    if (!refreshToken) return null;

    try {
      const configService = new ConfigService();
      const jwtService = new JwtService();
      const secret = configService.get<string>('APP_JWT_REFRESH_TOKEN_SECRET');
      const payload = await jwtService.verifyAsync<RefreshTokenPayload>(
        refreshToken,
        {
          secret,
        },
      );
      return payload.sessionId;
    } catch {
      return null;
    }
  },
);
