import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@InputType('OsInputType', { isAbstract: true })
@ObjectType()
export class Os {
  @Field(type => String, { nullable: true })
  @Prop()
  name?: string;

  @Field(type => String, { nullable: true })
  @Prop()
  version?: string;
}
