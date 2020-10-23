import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction,
): void {
    // captura o valor do authorization header
    const authHeader = request.headers.authorization;

    // verifica se o header existe
    if (!authHeader) {
        throw new AppError('JWT Token is missing!', 401);
    }

    // separa o bearer do token em si
    const [, token] = authHeader.split(' ');

    const { secret } = authConfig.jwt;

    try {
        const decodedToken = verify(token, secret);

        const { sub } = decodedToken as TokenPayload;

        request.user = { id: sub };

        return next();
    } catch {
        throw new AppError('Invalid JWT Token!', 401);
    }
}
