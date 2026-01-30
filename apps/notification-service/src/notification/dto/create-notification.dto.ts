import { IsEnum, IsString, IsUUID, Length } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
    @IsUUID()
    userId: string;

    @IsEnum(NotificationType)
    type: NotificationType;

    @IsString()
    @Length(1, 255)
    title: string;

    @IsString()
    message: string;
}
