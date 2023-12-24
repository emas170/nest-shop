import { Injectable } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { UserEntity } from '../user/user.entity';
import { hashPwd } from '../utils/hash-pwd';
import * as domain from 'domain';
import { json } from 'express';
import { JwtPayload } from './jwt-strategy';
import { sign } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  private async createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = 60 * 60 * 24;
    const accessToken = sign(
      payload,
      's8f5tjn4dtyjasgjesrpogtjdfbjsdhry5j4tyjhsfgkbhj',
      { expiresIn },
    );
    return {
      accessToken,
      expiresIn,
    };
  }

  private async generateToken(user: UserEntity): Promise<string> {
    let token;
    const userWithThisToken = null;
    do {
      token = uuid();
      userWithThisToken = await UserEntity.findOne({ currentTokenId: token });
    } while (!!userWithThisToken);
    user.currentTokenId = token;
    await user.save();
    return token;
  }
  async login(req: AuthLoginDto, res: Response): Promise<any> {
    try {
      const user = await UserEntity.findOne({
        email: req.email,
        pwdHash: hashPwd(req.pwd),
      });
      if (!user) {
        return res.json({ error: 'Invalid login data' });
      }
      const token = await this.createToken(await this.generateToken(user));
      return res
        .cookie('jwt', token.accessToken, {
          secure: false,
          domain: 'localhost',
          httpOnly: true,
        })
        .json({ ok: true });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }

  async logout(user: UserEntity, res: Response): Promise<any> {
    try {
      user.currentTokenId = null;
      await user.save();
      return res
        .clearCookie('jwt', {
          secure: false,
          domain: 'localhost',
          httpOnly: true,
        })
        .json({ ok: true });
    } catch (e) {
      return res.json({ error: e.message });
    }
}
