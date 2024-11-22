import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class ResetPasswordInput {
  @Field(type => String)
  token: string;

  @Field(type => String)
  password: string;
}

@ObjectType()
export class ResetPasswordOutput extends CoreOutput {}
