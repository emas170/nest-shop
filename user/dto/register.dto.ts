import { Controller } from '@nestjs/common';
import { IsString } from 'class-validator';

@Controller('user')
export class RegisterDto {
  email: string;
  pwd: string;
}
