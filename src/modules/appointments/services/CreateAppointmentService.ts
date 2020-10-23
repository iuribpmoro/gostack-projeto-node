import { injectable, inject } from 'tsyringe';

// importar model para sabermos formato dos appointments
import { startOfHour } from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
// importar repository para sabermos o formato do appointmentRepository
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

// formato do objeto recebido de argumento
interface IRequest {
    provider_id: string;
    date: Date;
}

// determina que essa classe pode receber injecao de dependencias
@injectable()
class CreateAppointmentService {
    constructor(
        // injeta o container
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    // metodo que recebe o provider e o parsedDate em um objeto, cria um appointment e o retorna ao usuario
    public async execute({
        provider_id,
        date,
    }: IRequest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        // se ja houver um appointment no mesmo horario do novo, envia mensagem de erro
        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked!');
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
