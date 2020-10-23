import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

// colocar decorator em cima da classe e como passar a classe como parametro para a entidade
@Entity('appointments')
class Appointment {
    // decorator para indicar chave primaria do tipo uuid
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // decorator para indicar coluna normal (formato varchar)
    @Column()
    provider_id: string;

    // especifica relacao n to 1 do agendamento para o model de user
    @ManyToOne(() => User)
    // atribui o valor a coluna de provider_id
    @JoinColumn({ name: 'provider_id' })
    provider: User;

    // decorator para indicar coluna do tipo timestamp...
    @Column('timestamp with time zone')
    date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // constructor nao e mais usado, pois temos de usar de metodos proprios do typeorm para construir um novo appointment
    // // especifica o tipo dos argumentso como iguais ao da classe, com excecao do id
    // constructor({ provider, date }: Omit<Appointment, 'id'>) {
    //     this.id = uuid();
    //     this.provider = provider;
    //     this.date = date;
    // }
}

export default Appointment;
