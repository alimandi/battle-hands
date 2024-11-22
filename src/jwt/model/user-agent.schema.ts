import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { Browser } from './browser.schema';
import { Cpu } from './cpu.schema';
import { Device } from './device.schema';
import { Engine } from './engine.schema';
import { Os } from './os.schema';

@InputType('UserAgentInputType', { isAbstract: true })
@ObjectType()
export class UserAgent {
  @Field(type => String)
  @Prop()
  ua: string;

  @Field(type => Browser, { nullable: true })
  @Prop()
  browser?: Browser;

  @Field(type => Engine, { nullable: true })
  @Prop()
  engine?: Engine;

  @Field(type => Os, { nullable: true })
  @Prop()
  os?: Os;

  @Field(type => Device, { nullable: true })
  @Prop()
  device?: Device;

  @Field(type => Cpu, { nullable: true })
  @Prop()
  cpu?: Cpu;
}
