import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern(MESSAGE_PATTERNS.notification.CREATE)
  create(@Payload() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @MessagePattern(MESSAGE_PATTERNS.notification.FIND_ALL)
  findAll() {
    return this.notificationService.findAll();
  }

  @MessagePattern(MESSAGE_PATTERNS.notification.FIND_ONE)
  findOne(@Payload() data: any) {
    return this.notificationService.findOne(data.id);
  }

  @MessagePattern(MESSAGE_PATTERNS.notification.UPDATE)
  update(@Payload() data: any) {
    return this.notificationService.update(data.id, data);
  }

  @MessagePattern(MESSAGE_PATTERNS.notification.DELETE)
  remove(@Payload() data: any) {
    return this.notificationService.remove(data.id);
  }
}
