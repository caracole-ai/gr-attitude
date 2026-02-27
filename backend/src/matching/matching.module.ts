import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from '../missions/entities/mission.entity';
import { Offer } from '../offers/entities/offer.entity';
import { Correlation } from '../correlations/entities/correlation.entity';
import { EventsModule } from '../events/events.module';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mission, Offer, Correlation]),
    forwardRef(() => EventsModule),
  ],
  providers: [MatchingService],
  controllers: [MatchingController],
  exports: [MatchingService],
})
export class MatchingModule {}
