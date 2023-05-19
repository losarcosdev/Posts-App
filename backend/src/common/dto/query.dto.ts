import { Type } from 'class-transformer';
import { IsString, IsOptional, IsIn } from 'class-validator';

export class QueryDto {
  @IsString()
  @IsOptional()
  @Type(() => String)
  order_title: 'asc' | 'desc' | 'ASC' | 'DESC';

  @IsString()
  @IsOptional()
  @Type(() => String)
  order_likes: 'asc' | 'desc' | 'ASC' | 'DESC';

  @IsString()
  @IsOptional()
  @Type(() => String)
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
  tag_selected: string;
}
