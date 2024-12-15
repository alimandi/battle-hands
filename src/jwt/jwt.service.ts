import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { Model, Types } from 'mongoose';

import { JWT_CONFIG_OPTIONS } from './jwt.constant';
import {
  JwtModuleOptions,
  JwtToken,
  switchAccountJwtToken,
} from './jwt.interface';
import { AllowedClient, Token, TokenDocument } from './schema/token.schema';
import { PasswordUtil } from 'src/common/utils/password';
import {
  GetActiveTokens,
  GetActiveTokensOutput,
} from 'src/auth/dto/get-active-tokens.dto';

@Injectable()
export class JwtService {
  constructor(
    @Inject(JWT_CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
    @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
  ) {}

  async hasToken(tokenStr: string, userId: string): Promise<boolean> {
    const rows = await this.tokenModel.find({ userId }).exec();
    let hasToken = false;
    for (const row of rows) {
      if (PasswordUtil.verifyHash(tokenStr, row.token)) {
        hasToken = true;
      }
    }
    return hasToken;
  }

  async hasRefreshToken(tokenStr: string, userId: string): Promise<boolean> {
    const rows = await this.tokenModel.find({ userId }).exec();
    let hasToken = false;
    for (const row of rows) {
      if (PasswordUtil.verifyHash(tokenStr, row.refreshToken)) {
        hasToken = true;
      }
    }
    return hasToken;
  }

  sign(userId: string): JwtToken {
    return {
      token: jwt.sign({ jti: userId }, this.options.privateKey, {
        expiresIn: `${this.options.tokenExpiration}d`,
      }),
      refreshToken: jwt.sign({ refreshId: userId }, this.options.privateKey, {
        expiresIn: `${this.options.refreshTokenExpritation}d`,
      }),
    };
  }

  switchAccountSign(userId: string): switchAccountJwtToken {
    const expiresInHours = 6;

    const token = jwt.sign({ jti: userId }, this.options.privateKey, {
      expiresIn: `${expiresInHours}h`,
    });

    const decoded = jwt.decode(token) as { exp: number };

    const expirationDate = new Date(decoded.exp * 1000);

    return {
      token,
      expiration: expirationDate,
    };
  }

  verify(token: string) {
    return jwt.verify(token, this.options.privateKey);
  }

  async saveToken(
    token: JwtToken,
    userId: string,
    clientType: AllowedClient,
    userAgent: string,
    expirationToken: Date,
    expirationRefreshToken: Date,
  ): Promise<Token> {
    const uaParser = require('ua-parser-js');
    const parser = new uaParser();
    const res = parser.setUA(userAgent).getResult();

    const entity = await this.tokenModel.create({
      token: PasswordUtil.hashPassword(token.token),
      refreshToken: PasswordUtil.hashPassword(token.refreshToken),
      clientType: AllowedClient[clientType],
      userAgent: res,
      userId,
      expirationRefreshToken,
      expirationToken,
    });
    const result = await entity.save();
    return result;
  }

  async revoke(userId: string, tokenStr: string): Promise<boolean> {
    const rows = await this.tokenModel.find({ userId: userId }).exec();
    let isDeleted = false;
    for await (const row of rows) {
      if (PasswordUtil.verifyHash(tokenStr, row.token)) {
        await this.tokenModel.deleteOne({ _id: row._id }).exec();
        isDeleted = true;
      }
    }
    return isDeleted;
  }

  async updateByRefreshToken(
    userId: string,
    refreshToken: string,
    token: JwtToken,
  ): Promise<boolean> {
    const rows = await this.tokenModel.find({ userId: userId }).exec();

    let isUpdated = false;
    for await (const row of rows) {
      if (PasswordUtil.verifyHash(refreshToken, row.refreshToken)) {
        await this.tokenModel.updateOne(
          { _id: row._id },
          {
            token: PasswordUtil.hashPassword(token.token),
            refreshToken: PasswordUtil.hashPassword(token.refreshToken),
          },
        );
        isUpdated = true;
      }
    }
    return isUpdated;
  }

  async getActiveTokens(_id: Types.ObjectId): Promise<GetActiveTokensOutput> {
    const currentDate = new Date();

    const userId = _id.toString();

    const tokens = await this.tokenModel.find({ userId });

    const sessions: GetActiveTokens[] = tokens
      .filter(
        (token) =>
          token.expirationRefreshToken > currentDate ||
          token.expirationToken > currentDate,
      )
      .map((token) => ({
        token: token.token,
        device: token.userAgent,
        clientType: token.clientType,
        refreshToken: token.refreshToken,
        expirationToken: token.expirationToken,
        expirationRefreshToken: token.expirationRefreshToken,
      }));

    return {
      sessions,
    };
  }
}
