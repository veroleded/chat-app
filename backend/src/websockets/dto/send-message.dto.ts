import { IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsString()
  text: string;
  @IsUUID()
  userId: string;
  @IsUUID()
  chatId: string;
}
