import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseService } from './database.service';
import { UserModelFactory } from 'src/user/schema/user.schema';

const models = MongooseModule.forFeatureAsync([UserModelFactory]);

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
        connectionFactory: (connection) => {
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    models,
  ],
  exports: [DatabaseService, models],
  providers: [DatabaseService],
})
export class DatabaseModule {}
