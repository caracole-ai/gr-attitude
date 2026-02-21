import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import databaseConfig from './config/database.config.js';
import redisConfig from './config/redis.config.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { MissionsModule } from './missions/missions.module.js';
import { ContributionsModule } from './contributions/contributions.module.js';
import { OffersModule } from './offers/offers.module.js';
import { CorrelationsModule } from './correlations/correlations.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { MatchingModule } from './matching/matching.module.js';
import { CronsModule } from './crons/crons.module.js';
import { AppController } from './app.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    MissionsModule,
    ContributionsModule,
    OffersModule,
    CorrelationsModule,
    NotificationsModule,
    MatchingModule,
    CronsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
