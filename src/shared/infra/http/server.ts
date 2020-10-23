import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container/';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    // se o erro for uma instancia de AppError (ou seja, nos conhecemos), manda os seus parametros
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    // se for um erro que nao conhecemos, printa ele e retorna como Internal Server Error
    console.log(err);

    return response.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
});

app.listen(3333, () => {
    console.log('Server started!');
});
