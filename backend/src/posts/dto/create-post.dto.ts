import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsIn([
    'bug',
    'enhacement',
    'error',
    'feature',
    'other',
    'project',
    'ui',
    'ux',
  ])
  tag: string;
}
