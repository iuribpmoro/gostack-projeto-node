import { inject, injectable } from 'tsyringe';
import path from 'path';
import fs from 'fs';

import AppError from '@shared/errors/AppError';

import uploadConfig from '@config/upload';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

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
            // verifica se o avatar realmente existe
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );
            const userAvatarFileExists = await fs.promises.stat(
                userAvatarFilePath,
            );

            // deleta o avatar antigo
            if (userAvatarFileExists) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        // atribui o nome do novo avatar do usuario
        user.avatar = avatarFilename;

        // como ja existe um usuario com esse id, vai atualizar as informacoes que foram mudadas
        await this.usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
