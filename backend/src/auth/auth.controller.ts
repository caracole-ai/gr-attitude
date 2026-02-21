import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  UseFilters,
  Request,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { LocalAuthGuard } from '../common/guards/local-auth.guard.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { GoogleAuthGuard } from '../common/guards/google-auth.guard.js';
import { FacebookAuthGuard } from '../common/guards/facebook-auth.guard.js';
import { OAuthExceptionFilter } from '../common/filters/oauth-exception.filter.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @CurrentUser() currentUser: { id: string },
    @Body() dto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(currentUser.id, dto.currentPassword || '', dto.newPassword);
    return { message: 'Password changed successfully' };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @UseFilters(OAuthExceptionFilter)
  googleCallback(@Request() req: any, @Res() res: Response) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const { accessToken } = req.user;
    res.redirect(`${frontendUrl}/callback#token=${accessToken}`);
  }

  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  facebookAuth() {
    // Guard redirects to Facebook
  }

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  @UseFilters(OAuthExceptionFilter)
  facebookCallback(@Request() req: any, @Res() res: Response) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const { accessToken } = req.user;
    res.redirect(`${frontendUrl}/callback#token=${accessToken}`);
  }
}
