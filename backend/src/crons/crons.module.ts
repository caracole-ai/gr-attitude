import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from '../missions/entities/mission.entity.js';
import { Notification } from '../notifications/entities/notification.entity.js';
import { MissionExpirationCron } from './mission-expiration.cron.js';

@Module({
  imports: [TypeOrmModule.forFeature([Mission, Notification])],
  providers: [MissionExpirationCron],
})
export class CronsModule {}
