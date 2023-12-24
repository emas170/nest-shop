import { Body, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from './user.entity';
import { hashPwd } from '../utils/hash-pwd';
import { RegisterUserResponse } from '../interface/user';
import { Command, Console } from 'nestjs-console';

@Injectable()
@Console({
  name: 'users',
})
export class UserService {
  filter(user: UserEntity): RegisterUserResponse {
    const { id, email } = user;
    return { id, email };
  }
  async register(@Body() newUser: RegisterDto): Promise<UserEntity> {
    const user = new UserEntity();
    user.email = newUser.email;
    user.pwdHash = hashPwd(newUser.pwd);
    await user.save();
    return user;
  }
  async getOneUser(): Promise<UserEntity> {
    return await UserEntity.findOne();
  }
  @Command({
    command: 'list',
    description: 'list all of the users',
  })
  async listUsersCmd() {
    console.log((await UserEntity.find()).map(this.filter));
  }
  @Command({
    command: 'add <email> <pwd>',
    description: 'add new user',
  })
  async addUsersCmd(email: string, pwd: string) {
    console.log((await this.register({ email, pwd })).id);
  }
}
