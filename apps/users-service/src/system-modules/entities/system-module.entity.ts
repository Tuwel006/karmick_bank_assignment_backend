import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('system_modules')
export class SystemModule {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string; // e.g. 'ACCOUNTS', 'TRANSACTIONS'

    @OneToMany(() => Permission, (permission) => permission.systemModule)
    permissions: Permission[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
