import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  // metodo findByDate recebe a data que deseja procurar e retorna o appointment caso exista ou undefined caso nao exista
  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(appointment => isEqual(appointment.date, date));

    return findAppointment;
  }

  public async create({
      provider_id,
      date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    // para nao precisar especificar cada um dos elementos do appointment (appointment.id = uuid())
    Object.assign(appointment, {id: uuid(), date, provider_id });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
