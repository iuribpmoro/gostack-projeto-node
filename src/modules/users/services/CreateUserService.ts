import { inject, injectable } from 'tsyringe';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

// define o formato dos dados do usuario
interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('IHashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ name, email, password }: IRequest): Promise<User> {
        // verifica se email ja esta cadastrado
        const checkUserExists = await this.usersRepository.findByEmail(email);

        // se estiver, retorna um erro
        if (checkUserExists) {
            throw new AppError('Email address already used!');
        }

        // gera uma hash da password com salt de tamanho 8
        const hashedPassword = await this.hashProvider.generateHash(password);

        // cria um user
        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        // retorna o user criado
        return user;
    }
}

export default CreateUserService;
