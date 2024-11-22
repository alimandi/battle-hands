import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { AllowedClient } from 'src/jwt/schema/token.schema';
import { User } from 'src/user/schema/user.schema';

@InputType({ description: 'signUp Input.' })
export class SingUpInput {
  @Field((type) => AllowedClient, { description: 'Client Type.' })
  clientType: AllowedClient;

  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @MinLength(8)
  @Field()
  password: string;

  @IsString()
  @Field()
  fullname: string;
}

@ObjectType({ description: 'signUp Output.' })
export class SignUpOutput {
  @Field((type) => String, { description: 'JWT token.', nullable: true })
  token?: string;

  @Field((type) => String, { description: 'Refresh token.', nullable: true })
  refreshToken?: string;

  @Field((type) => Date, { nullable: true })
  expirationToken?: Date;

  @Field((type) => Date, { nullable: true })
  expirationRefreshToken?: Date;

  @Field((type) => User, {
    description: 'Logged in user object.',
    nullable: true,
  })
  user?: User;
}
