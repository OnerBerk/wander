import {IsOptional, IsArray, IsInt, Min, Max, IsIn} from 'class-validator';
import {Type, Transform} from 'class-transformer';
import {GeoDto} from '../../common-dtos/geo.dto';
import {PriceType, EventTag, EventPeriod} from '@wander/types';

const ALLOWED_TAGS: EventTag[] = [
  'Art contemporain',
  'Conférence',
  'Concert',
  'Enfants',
  'Expo',
  'Festival',
  'Gourmand',
  'Histoire',
  'Loisirs',
  'Nature',
  'Spectacle musical',
  'Théâtre',
];

export class QueryFilterDto extends GeoDto {
  @IsOptional()
  @Transform(({value}) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray()
  @IsIn(ALLOWED_TAGS, {each: true, message: 'invalid tag'})
  tags?: EventTag[];

  @IsOptional()
  @IsIn(['free', 'paid'], {message: 'price must be free or paid'})
  price?: PriceType;

  @IsOptional()
  @IsIn(['today', 'week', 'month', 'all'], {message: 'period must be today, week, month or all'})
  period?: EventPeriod;

  @IsOptional()
  @Type(() => Number)
  @IsInt({message: 'limit must be an integer'})
  @Min(1, {message: 'limit must be at least 1'})
  @Max(100, {message: 'limit cannot exceed 100'})
  limit?: number;
}
