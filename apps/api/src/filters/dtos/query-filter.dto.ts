import {IsOptional, IsString, IsInt, Min, Max, IsIn} from 'class-validator';
import {Type} from 'class-transformer';
import {GeoDto} from '../../common-dtos/geo.dto';
import {PriceType} from '@wander/types';

export class QueryFilterDto extends GeoDto {
  @IsOptional()
  @IsString({message: 'tag must be a string'})
  tag?: string;

  @IsOptional()
  @IsIn(['free', 'paid'], {message: 'price must be free or paid'})
  price?: PriceType;

  @IsOptional()
  @Type(() => Number)
  @IsInt({message: 'limit must be an integer'})
  @Min(1, {message: 'limit must be at least 1'})
  @Max(100, {message: 'limit cannot exceed 100'})
  limit?: number;
}
