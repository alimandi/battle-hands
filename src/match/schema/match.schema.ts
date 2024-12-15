import { InternalServerErrorException } from '@nestjs/common';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  AsyncModelFactory,
  getModelToken,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Document, Model, Types } from 'mongoose';
import { ObjectIdScalar } from 'src/common/scalar/ObjectIdScalar';
import { CoreSchema } from 'src/common/schema/core.schema';
import { PasswordUtil } from 'src/common/utils/password';
import { User } from 'src/user/schema/user.schema';

export type MatchDocument = Match & Document;

@InputType('MatchInputType', { isAbstract: true })
@ObjectType()
@Schema({
  collection: 'matches',
  timestamps: true,
  versionKey: false,
})
export class Match extends CoreSchema {
  @Field((type) => Number)
  @Prop({ required: true })
  score: number;

  @Field((type) => [ObjectIdScalar])
  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  _users: Types.ObjectId[];
}

export const MatchSchema = SchemaFactory.createForClass(Match);

export const MatchModelFactory: AsyncModelFactory = {
  name: Match.name,
  useFactory: () => {
    const schema = MatchSchema;

    return schema;
  },
};
