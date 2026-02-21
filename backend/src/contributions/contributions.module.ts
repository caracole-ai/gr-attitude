import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contribution } from './entities/contribution.entity.js';
import { Mission } from '../missions/entities/mission.entity.js';
import { Notification } from '../notifications/entities/notification.entity.js';
import { ContributionsService } from './contributions.service.js';
import { ContributionsController } from './contributions.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Contribution, Mission, Notification])],
  providers: [ContributionsService],
  controllers: [ContributionsController],
  exports: [ContributionsService],
})
export class ContributionsModule {}
