import { Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserEntity } from '../user/user.entity';

export interface JwtPayload {
  id: string;
}

function cookieExtractor(req: any): string | null {
  return req && req.cookies ? req.cookies?.jwt : null;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: 's8f5tjn4dtyjasgjesrpogtjdfbjsdhry5j4tyjhsfgkbhj',
    });
  }
  async validate(payload: JwtPayload, done: (error, user) => void) {
    if (!payload || !payload.id) {
      return done(new UnauthorizedException(), false);
    }
    const user = await UserEntity.findOne({ currentTokenId: payload.id });
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }
}
