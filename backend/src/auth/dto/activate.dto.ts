import { IsString } from 'class-validator';

export class UserActivateDto {
  @IsString()
  code: string;
}
