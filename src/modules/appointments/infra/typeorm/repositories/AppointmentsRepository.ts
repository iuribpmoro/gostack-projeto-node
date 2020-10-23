import { getRepository, Repository } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
    // declarar a variavel ormRepository do tipo Repository de Appointment
    private ormRepository: Repository<Appointment>;

    // constructor executa ao chamar a classe e seta o ormRepository para um Repository de Appointment
    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    // metodo findByDate recebe a data que deseja procurar e retorna o appointment caso exista ou undefined caso nao exista
    public async findByDate(date: Date): Promise<Appointment | undefined> {
        // por ser uma funcao assincrona, sempre retorna uma promise, e a promise retorna o Appointment ou undefined

        // usa do metodo findOne do TypeORM para encontrar um dado onde o campo date seja igual ao date passado ao repository
        const findAppointment = await this.ormRepository.findOne({
            where: { date },
        });

        // retorna o valor caso exista um appointment nessa date ou undefined
        return findAppointment;
    }

    public async create({
        provider_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({ provider_id, date });

        await this.ormRepository.save(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;
