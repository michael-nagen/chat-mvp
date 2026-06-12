import { IsEmail } from 'class-validator';

export class CreateConversationDto {
  @IsEmail()
  email!: string;
}
