import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreOutput {
  @Field(type => String, { nullable: true })
  message?: string;
}
