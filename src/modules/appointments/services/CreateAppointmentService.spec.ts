import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';
import AppError from '@shared/errors/AppError';

// describe cria uma categoria de testes
describe('CreateAppointment', () => {
  // forma de criar um teste
  it('should be able to create a new appointment', async () => {
    // precisamos instanciar para passar como parametro para o service, ja que nao usaremos injecao de dependencias
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '2154215215',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('2154215215');

  });

  it('should not be able to create two appointments at the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

    const appointmentDate = new Date(2020, 10, 20, 17);

    const appointment = await createAppointment.execute({
      date: appointmentDate,
      provider_id: '2154215215',
    });

    expect(createAppointment.execute({
      date: appointmentDate,
      provider_id: '2154215215',
    })).rejects.toBeInstanceOf(AppError);

  })
});
