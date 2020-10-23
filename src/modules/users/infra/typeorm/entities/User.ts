import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

// colocar decorator em cima da classe e como passar a classe como parametro para a entidade
@Entity('users')
class User {
    // decorator para indicar chave primaria do tipo uuid
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // decorator para indicar coluna normal (formato varchar)
    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    avatar: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default User;
