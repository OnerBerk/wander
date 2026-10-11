import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class EventIdDto {
  @IsString({ message: 'ERROR_ID_MUST_BE_A_STRING' })
  @IsNotEmpty({ message: 'ERROR_ID_IS_REQUIRED' })
  @MaxLength(128, { message: 'ERROR_ID_TOO_LONG' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'ERROR_INVALID_ID',
  })
  id!: string;
}
