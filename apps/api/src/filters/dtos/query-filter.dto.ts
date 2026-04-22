import {IsOptional, IsString, IsInt, IsNumber, Min, Max, Matches} from 'class-validator';
import {Type} from 'class-transformer';

export class QueryFilterDto {
  @IsOptional()
  @IsString({message: 'filter must be a string'})
  @Matches(/^([a-zA-Z]+:[a-zA-Z0-9\s]+)(,[a-zA-Z]+:[a-zA-Z0-9\s]+)*$/, {
    message: 'filter must be in format key:value,key:value (e.g. tag:Musique,price:gratuit)',
  })
  filter?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, {message: 'lat must be a number'})
  lat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, {message: 'lng must be a number'})
  lng?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, {message: 'radius must be a number'})
  @Min(0.1, {message: 'radius must be at least 0.1 km'})
  @Max(50, {message: 'radius cannot exceed 50 km'})
  radius?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({message: 'limit must be an integer'})
  @Min(1, {message: 'limit must be at least 1'})
  @Max(100, {message: 'limit cannot exceed 100'})
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({message: 'offset must be an integer'})
  @Min(0, {message: 'offset must be at least 0'})
  offset?: number;
}
