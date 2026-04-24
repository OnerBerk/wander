import {Type} from 'class-transformer';
import {IsNumber, Max, Min} from 'class-validator';

export class GeoDto {
  @Type(() => Number)
  @IsNumber({}, {message: 'lat must be a number'})
  lat!: number;

  @Type(() => Number)
  @IsNumber({}, {message: 'lng must be a number'})
  lng!: number;

  @Type(() => Number)
  @IsNumber({}, {message: 'radius must be a number'})
  @Min(0.1, {message: 'radius must be at least 0.1 km'})
  @Max(50, {message: 'radius cannot exceed 50 km'})
  radius!: number;
}
