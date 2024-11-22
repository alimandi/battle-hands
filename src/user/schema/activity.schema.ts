import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ActivityDocument = Activity & Document;

@InputType('ActivityInputType', { isAbstract: true })
@ObjectType()
export class Activity {
  @Field(type => String)
  @Prop()
  user_agent: string;

  @Field(type => Date)
  @Prop()
  date: Date;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
