import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { TOKEN_HEADER_KEY, TOKEN_PREFIX } from './jwt.constant';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (TOKEN_HEADER_KEY in req.headers || TOKEN_HEADER_KEY in req.query) {
      const token = req.headers[TOKEN_HEADER_KEY]
        ? req.headers[TOKEN_HEADER_KEY].replace(TOKEN_PREFIX, '').trim()
        : req.query[TOKEN_HEADER_KEY];

      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('jti')) {
          // const hasToken = await this.jwtService.hasToken(
          //   token.toString(),
          //   decoded['jti'],
          // );
          // if (hasToken) {
          const user = await this.usersService.findById(decoded['jti']);
          req['user'] = user;
          // } else {
          //   throw new UnauthorizedException();
          // }
        }
      } catch (e) {}
    }
    next();
  }
}
