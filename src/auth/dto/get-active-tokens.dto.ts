import { Field, ObjectType } from '@nestjs/graphql';
import { UserAgent } from 'src/jwt/model/user-agent.schema';

@ObjectType()
export class GetActiveTokens {
  @Field(type => String)
  token: string;

  @Field(type => String)
  refreshToken: string;

  @Field(type => String)
  clientType: string;

  @Field(type => UserAgent, { nullable: true })
  device?: UserAgent;

  @Field(type => Date)
  expirationToken: Date;

  @Field(type => Date)
  expirationRefreshToken: Date;
}

@ObjectType()
export class GetActiveTokensOutput {
  @Field(type => [GetActiveTokens])
  sessions: GetActiveTokens[];
}
