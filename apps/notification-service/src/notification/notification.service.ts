import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification, NotificationStatus } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) { }

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepository.create(createNotificationDto);
    return await this.notificationRepository.save(notification);
  }

  async findAll() {
    return await this.notificationRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) throw new NotFoundException(`Notification ${id} not found`);
    return notification;
  }

  async findByUserId(userId: string) {
    return await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    await this.notificationRepository.update(id, updateNotificationDto);
    return this.findOne(id);
  }

  async markAsRead(id: string) {
    await this.notificationRepository.update(id, { status: NotificationStatus.READ });
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.notificationRepository.delete(id);
  }
}
