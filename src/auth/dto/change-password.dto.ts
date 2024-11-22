import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class ChangePasswordInput {
  @IsString()
  @MinLength(8)
  @Field(type => String)
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @Field(type => String)
  password: string;
}

@ObjectType()
export class ChangePasswordOutput {
  @Field(type => String)
  message: string;
}
