import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum NotificationType {
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    TRANSACTION = 'TRANSACTION',
}

export enum NotificationStatus {
    UNREAD = 'UNREAD',
    READ = 'READ',
}

@Entity({ name: 'notifications' })
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ type: 'uuid' })
    userId: string; // Reference to users.id

    @Column({ type: 'enum', enum: NotificationType, default: NotificationType.INFO })
    type: NotificationType;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.UNREAD })
    status: NotificationStatus;

    @CreateDateColumn()
    createdAt: Date;
}
