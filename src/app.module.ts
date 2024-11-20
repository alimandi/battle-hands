import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './common/config/validation';

import {
  configuration,
  environmentFilePath,
} from './common/config/configuration';
import { UserModule } from './user/user.module';
import { MatchModule } from './match/match.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: environmentFilePath,
      load: [configuration],
      validationSchema,
    }),
    UserModule,
    MatchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
