import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class RequestResetPasswordInput {
  @Field((type) => String)
  email: string;
}

@ObjectType()
export class RequestResetPasswordOutput extends CoreOutput {}
