import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegistrationUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(12)
  nickname: string;
}
