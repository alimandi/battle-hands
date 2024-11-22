import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { AllowedClient } from 'src/jwt/schema/token.schema';
import { User } from 'src/user/schema/user.schema';

@InputType({ description: 'Login Input.' })
export class LoginInput extends PickType(User, ['email', 'password']) {
  @Field(type => AllowedClient, { description: 'Client Type.' })
  clientType: AllowedClient;

  @Field(type => String)
  password: string;
}

@ObjectType({ description: 'Login Output.' })
export class LoginOutput {
  @Field(type => String, { description: 'JWT token.', nullable: true })
  token?: string;

  @Field(type => String, { description: 'Refresh token.', nullable: true })
  refreshToken?: string;

  @Field(type => Date, { nullable: true })
  expirationToken?: Date;

  @Field(type => Date, { nullable: true })
  expirationRefreshToken?: Date;

  @Field(type => User, {
    description: 'Logged in user object.',
    nullable: true,
  })
  user?: User;
}
