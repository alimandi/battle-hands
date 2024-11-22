import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CountryCode } from 'libphonenumber-js';
import { User } from '../../user/schema/user.schema';

@InputType()
export class EditProfileInput extends PickType(PartialType(User), [
  'fullname',
  'email',
] as const) {
  @Field((type) => String, { defaultValue: 'IR' })
  region?: CountryCode;

  @Field((type) => String, { nullable: true })
  phone?: string;
}

@ObjectType()
export class EditProfileOutput {
  @Field((type) => String)
  message: string;

  @Field((type) => User, { nullable: true })
  user?: User;
}
