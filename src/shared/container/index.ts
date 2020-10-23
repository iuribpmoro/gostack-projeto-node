import { container } from 'tsyringe';

import '@modules/users/providers/';
import '@shared/container/providers';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

// primeiro o nome que o container tera e depois o repositorio que ele representara
// A tipagem garante que o retorno seja exatamente desse tipo
// registerSingleton faz com que instancie o repositorio apenas uma vez durante todo o ciclo de vida da aplicacao
container.registerSingleton<IAppointmentsRepository>(
    'AppointmentsRepository',
    AppointmentsRepository,
);

container.registerSingleton<IUsersRepository>(
    'UsersRepository',
    UsersRepository,
);
