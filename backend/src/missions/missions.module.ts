import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from './entities/mission.entity.js';
import { Contribution } from '../contributions/entities/contribution.entity.js';
import { Correlation } from '../correlations/entities/correlation.entity.js';
import { Notification } from '../notifications/entities/notification.entity.js';
import { MissionsService } from './missions.service.js';
import { MissionsController } from './missions.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mission, Contribution, Correlation, Notification]),
  ],
  providers: [MissionsService],
  controllers: [MissionsController],
  exports: [MissionsService],
})
export class MissionsModule {}
