import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Address } from '../../address/entities/address.entity';

@Entity('branches')
export class Branch {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ unique: true, length: 11 })
    ifsc: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @ManyToOne(() => Address, { nullable: true })
    @JoinColumn({ name: 'address_id' })
    address: Address;

    @OneToMany(() => User, (user) => user.branch)
    users: User[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
