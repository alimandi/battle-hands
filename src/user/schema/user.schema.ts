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
import { CoreSchema } from 'src/common/schema/core.schema';
import { PasswordUtil } from 'src/common/utils/password';
import { Activity } from './activity.schema';

export type UserDocument = User & Document;

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Schema({
  collection: 'users',
  timestamps: true,
  versionKey: false,
})
export class User extends CoreSchema {
  @IsEmail()
  @Field((type) => String)
  @Prop({ required: true, trim: true, lowercase: true, unique: true })
  email: string;

  @IsString()
  @Field((type) => String)
  @Prop({ required: true, trim: true })
  fullname: string;

  @IsString()
  @MinLength(8)
  @Prop({ required: true })
  password: string;

  @Prop()
  resetPasswordToken?: string;

  @Field((type) => [Activity], { nullable: true })
  @Prop([Activity])
  loginHistory?: Activity[];

  @Field((type) => Activity, { nullable: true })
  @Prop()
  lastActivity?: Activity;

  checkPassword: Function;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserModelFactory: AsyncModelFactory = {
  name: User.name,
  useFactory: () => {
    const schema = UserSchema;

    schema.methods.checkPassword = async function (
      aPassword: string,
    ): Promise<boolean> {
      try {
        return await PasswordUtil.verifyHash(aPassword, this.password);
      } catch (e) {
        throw new InternalServerErrorException(
          'Error in checkPassword function.',
        );
      }
    };

    schema.pre<UserDocument>('save', function (next) {
      const user = this;

      if (user.password && this.isModified('password')) {
        user.password = PasswordUtil.hashPassword(user.password);
      }

      next();
    });

    return schema;
  },
};
