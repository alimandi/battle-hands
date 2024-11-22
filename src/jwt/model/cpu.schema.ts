import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@InputType('CpuInputType', { isAbstract: true })
@ObjectType()
export class Cpu {
  @Field(type => String, { nullable: true })
  @Prop()
  architecture?: string;
}
