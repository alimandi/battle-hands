import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@InputType('EngineInputType', { isAbstract: true })
@ObjectType()
export class Engine {
  @Field(type => String, { nullable: true })
  @Prop()
  name?: string;

  @Field(type => String, { nullable: true })
  @Prop()
  version?: string;
}
