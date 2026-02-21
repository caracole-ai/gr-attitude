import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { LocalStrategy } from './strategies/local.strategy.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { GoogleStrategy } from './strategies/google.strategy.js';
import { FacebookStrategy } from './strategies/facebook.strategy.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret && process.env.NODE_ENV === 'production') {
          throw new Error('JWT_SECRET environment variable is required in production');
        }
        return {
          secret: secret || 'dev-secret-key',
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRES_IN', '1h') as any,
            algorithm: 'HS256' as const,
          },
        };
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy, FacebookStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
