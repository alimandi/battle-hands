import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/schema/user.schema';

@ObjectType()
export class MeOutput {
  @Field(type => User, { nullable: true })
  user?: User;
}
