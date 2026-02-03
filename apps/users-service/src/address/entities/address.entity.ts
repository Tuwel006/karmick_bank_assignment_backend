import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('addresses')
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'address_line_1' })
    addressLine1: string;

    @Column({ name: 'address_line_2', nullable: true })
    addressLine2: string;

    @Column({ nullable: true })
    landmark: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    pincode: string;

    @Column()
    country: string;

    @Column({ type: 'enum', enum: ['permanent', 'temporary', 'office'], default: 'permanent' })
    type: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}