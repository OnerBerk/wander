import { IsDefined, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChatDto {
  @IsDefined({ message: 'ERROR_MESSAGE_REQUIRED' })
  @IsString({ message: 'ERROR_MESSAGE_STRING' })
  @IsNotEmpty({ message: 'ERROR_MESSAGE_NOT_EMPTY' })
  @MinLength(5, { message: 'ERROR_MESSAGE_MIN_LENGTH_MIN_5' })
  @MaxLength(1000, { message: 'ERROR_MESSAGE_MAX_LENGTH_MAX_1000' })
  message!: string;
}
