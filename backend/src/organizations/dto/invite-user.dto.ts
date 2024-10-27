import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class InviteUserDTO {
  @ApiProperty()
  @IsEmail()
  user_email: string;
}
