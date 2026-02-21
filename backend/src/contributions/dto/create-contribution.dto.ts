import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ContributionType } from '../../shared/enums.js';

export class CreateContributionDto {
  @IsEnum(ContributionType)
  type: ContributionType;

  @IsOptional()
  @IsString()
  message?: string;
}
