import { Body, Controller, Inject, Post } from '@nestjs/common';
import { RegisterUserResponse } from '../interface/user';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';

@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}
  @Post('/register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterUserResponse> {
    return await this.userService.register(registerDto);
  }
}
