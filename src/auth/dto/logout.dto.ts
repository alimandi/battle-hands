import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class LogoutInput {
  @Field(type => String)
  token: string;

  @Field(type => String)
  userId: string;
}

@ObjectType()
export class LogoutOutput {
  @Field(type => Boolean)
  success: boolean;
}
