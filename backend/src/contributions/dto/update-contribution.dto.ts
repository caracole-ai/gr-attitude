import { IsOptional, IsString } from 'class-validator';

export class UpdateContributionDto {
  @IsOptional()
  @IsString()
  message?: string;
}
