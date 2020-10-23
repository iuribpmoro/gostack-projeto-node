import { inject, injectable } from 'tsyringe';
import path from 'path';
import fs from 'fs';

import AppError from '@shared/errors/AppError';

import uploadConfig from '@config/upload';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

// formato do request recebido
interface IRequest {
    user_id: string;
    avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
        // verifica se o usuario existe, senao, retorna erro
        const user = await this.usersRepository.findById(user_id);
        if (!user) {
            throw new AppError(
                'Only authenticated users can change avatar',
                401,
            );
        }

        // verifica se o usuario ja possui avatar
        if (user.avatar) {
            this.storageProvider.deleteFile(user.avatar);
        }

        const filename = await this.storageProvider.saveFile(avatarFilename);

        // atribui o nome do novo avatar do usuario
        user.avatar = filename;

        // como ja existe um usuario com esse id, vai atualizar as informacoes que foram mudadas
        await this.usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
