import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Mission } from '../missions/entities/mission.entity.js';
import { Contribution } from '../contributions/entities/contribution.entity.js';
import { Offer } from '../offers/entities/offer.entity.js';
import { Notification } from '../notifications/entities/notification.entity.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Mission, Contribution, Offer, Notification])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
