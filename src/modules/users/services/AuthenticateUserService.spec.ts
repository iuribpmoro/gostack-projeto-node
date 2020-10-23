import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserService from './AuthenticateUserService';
import AppError from '@shared/errors/AppError';

import CreateUserService from './CreateUserService';

describe('CreateUser', () => {

  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

    const user = await createUser.execute({
      name: 'Teste Teste',
      email: 'teste@teste.com',
      password: 'password',
    });

    const response = await authenticateUser.execute({
      email: 'teste@teste.com',
      password: 'password',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate an unknown user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

    expect(authenticateUser.execute({
      email: 'testeerrado@teste.com',
      password: 'password',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate a user with a wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

    await createUser.execute({
      name: 'Teste Teste',
      email: 'teste@teste.com',
      password: 'password',
    });

    expect(authenticateUser.execute({
      email: 'teste@teste.com',
      password: 'senhaerrada',
    })).rejects.toBeInstanceOf(AppError);
  });
});
