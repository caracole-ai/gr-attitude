import { Controller, Get, UseGuards } from '@nestjs/common';
import { MatchingService } from './matching.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @UseGuards(JwtAuthGuard)
  @Get('suggestions')
  getSuggestions(@CurrentUser() user: { id: string }) {
    return this.matchingService.getSuggestionsForUser(user.id);
  }
}
