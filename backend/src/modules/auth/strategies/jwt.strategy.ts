import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService, JwtPayload } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error(
        'JWT_SECRET is not defined. Please set it in your environment variables.'
      );
    }

    if (process.env.NODE_ENV === 'production' && jwtSecret.length < 32) {
      throw new Error(
        'JWT_SECRET must be at least 32 characters long in production.'
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validateJwt(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
