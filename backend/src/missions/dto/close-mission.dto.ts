import { IsOptional, IsString } from 'class-validator';

export class CloseMissionDto {
  @IsOptional()
  @IsString()
  closureFeedback?: string;

  @IsOptional()
  @IsString()
  closureThanks?: string;
}
