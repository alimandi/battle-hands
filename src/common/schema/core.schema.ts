import { Field, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types } from 'mongoose';
import { ObjectIdScalar } from '../scalar/ObjectIdScalar';

@ObjectType()
export class CoreSchema {
  @IsObjectId({ message: 'Object Id is not valid.' })
  @Field((type) => ObjectIdScalar)
  _id: Types.ObjectId;

  @Field((type) => Date, { nullable: true })
  @Prop()
  createdAt?: Date;

  @Field((type) => Date, { nullable: true })
  @Prop()
  updatedAt?: Date;
}
