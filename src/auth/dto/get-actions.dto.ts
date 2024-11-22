import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/schema/user.schema';

@ObjectType()
export class GetActionsOutput {
  @Field(type => [String])
  actions: string[];
}
