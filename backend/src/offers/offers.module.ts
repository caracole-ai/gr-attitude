import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity.js';
import { Correlation } from '../correlations/entities/correlation.entity.js';
import { OffersService } from './offers.service.js';
import { OffersController } from './offers.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Correlation])],
  providers: [OffersService],
  controllers: [OffersController],
  exports: [OffersService],
})
export class OffersModule {}
