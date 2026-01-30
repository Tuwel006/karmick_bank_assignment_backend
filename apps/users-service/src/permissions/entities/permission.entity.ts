import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, Unique } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { SystemModule } from '../../system-modules/entities/system-module.entity';

@Entity('permissions')
@Unique(['role', 'systemModule'])
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @Column()
    roleId: string;

    @ManyToOne(() => SystemModule, (module) => module.permissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'module_id' })
    systemModule: SystemModule;

    @Column()
    moduleId: string;

    @Column({ default: false })
    canGet: boolean;

    @Column({ default: false })
    canCreate: boolean;

    @Column({ default: false })
    canUpdate: boolean;

    @Column({ default: false })
    canDelete: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
