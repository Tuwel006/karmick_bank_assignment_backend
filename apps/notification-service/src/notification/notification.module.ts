import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from './entities/notification.entity';
import { DatabaseModule } from '../../../../shared/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Notification]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule { }
