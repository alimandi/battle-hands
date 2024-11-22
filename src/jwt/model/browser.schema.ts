import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@InputType('BrowserInputType', { isAbstract: true })
@ObjectType()
export class Browser {
  @Field(type => String, { nullable: true })
  @Prop()
  name?: string;

  @Field(type => String, { nullable: true })
  @Prop()
  version?: string;

  @Field(type => String, { nullable: true })
  @Prop()
  major?: string;
}
