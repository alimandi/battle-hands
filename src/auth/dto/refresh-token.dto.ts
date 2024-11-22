import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class RefreshTokenInput {
  @Field(type => String)
  refreshToken: string;
}

@ObjectType()
export class RefreshTokenOutput {
  @Field(type => String, { nullable: true })
  token?: string;

  @Field(type => String, { nullable: true })
  refreshToken?: string;

  @Field(type => Date, { nullable: true })
  expirationToken?: Date;

  @Field(type => Date, { nullable: true })
  expirationRefreshToken?: Date;
}
