import {
  IsString,
  IsArray,
  IsOptional,
  IsInt,
  Min,
  Max,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  skills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  interests?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(168) // Max hours per week
  availabilityHours?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000) // Max distance in km
  maxDistanceKm?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(12) // Max all categories
  preferredCategories?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(3) // faible, moyen, urgent
  preferredUrgencies?: string[];
}
