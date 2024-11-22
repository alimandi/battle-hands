import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@InputType('DeviceInputType', { isAbstract: true })
@ObjectType()
export class Device {
  @Field(type => String)
  @Prop()
  vendor: string;

  @Field(type => String, { nullable: true })
  @Prop()
  model?: string;

  @Field(type => String, { nullable: true })
  @Prop()
  type?: string;
}
