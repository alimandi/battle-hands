import { InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  AsyncModelFactory,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserAgent } from '../model/user-agent.schema';
import { CoreSchema } from 'src/common/schema/core.schema';

export type TokenDocument = Token & Document;

export enum AllowedClient {
  webApp,
  androidApp,
  androidTvApp,
  iosApp,
}

registerEnumType(AllowedClient, {
  name: 'AllowedClient',
  description: 'The supported clients.',
});
@InputType('TokenInputType', { isAbstract: true })
@ObjectType()
@Schema({
  timestamps: true,
  versionKey: false,
})
export class Token extends CoreSchema {
  @Prop()
  token: string;

  @Prop()
  refreshToken: string;

  @Prop({
    type: String,
    enum: ['webApp', 'androidApp', 'iosApp', 'androidTv'],
  })
  clientType: string;

  @Prop(UserAgent)
  userAgent: UserAgent;

  @Prop()
  userId: string;

  @Prop()
  lastActivity: Date;

  @Prop()
  expirationToken: Date;

  @Prop()
  expirationRefreshToken: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
export const TokenModelFactory: AsyncModelFactory = {
  name: Token.name,
  useFactory: () => {
    return TokenSchema;
  },
};
