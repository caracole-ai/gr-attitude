import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from './entities/mission.entity';
import { Contribution } from '../contributions/entities/contribution.entity';
import { Correlation } from '../correlations/entities/correlation.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { EventsModule } from '../events/events.module';
import { MissionsService } from './missions.service';
import { MissionsController } from './missions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Mission,
      Contribution,
      Correlation,
      Notification,
    ]),
    forwardRef(() => EventsModule),
  ],
  providers: [MissionsService],
  controllers: [MissionsController],
  exports: [MissionsService],
})
export class MissionsModule {}
