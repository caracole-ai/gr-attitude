import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from '../missions/entities/mission.entity.js';
import { Offer } from '../offers/entities/offer.entity.js';
import { Correlation } from '../correlations/entities/correlation.entity.js';
import { MatchingService } from './matching.service.js';
import { MatchingController } from './matching.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Mission, Offer, Correlation])],
  providers: [MatchingService],
  controllers: [MatchingController],
  exports: [MatchingService],
})
export class MatchingModule {}
