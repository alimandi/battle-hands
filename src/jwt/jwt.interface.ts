export interface JwtModuleOptions {
  privateKey: string;
  tokenExpiration: number;
  refreshTokenExpritation: number;
}

export interface JwtToken {
  token: string;
  refreshToken: string;
}

export interface switchAccountJwtToken {
  token: string;

  expiration: Date;
}
