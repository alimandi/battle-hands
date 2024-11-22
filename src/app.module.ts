import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from './common/config/validation';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {
  configuration,
  environmentFilePath,
} from './common/config/configuration';
import { UserModule } from './user/user.module';
import { TOKEN_HEADER_KEY } from './jwt/jwt.constant';
import { MatchModule } from './match/match.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { AuthMiddleware } from './auth/auth.middleware';
import { UserService } from './user/user.service';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from './auth/guard/permissions.guard';
import { PermissionsRestGuard } from './auth/guard/permissions-rest.guard';
import { CommonModule } from './common/common.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: environmentFilePath,
      load: [configuration],
      validationSchema,
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: process.env.NODE_ENV !== 'production',
      introspection: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      context: ({ req, connection }) => ({
        token: req
          ? req.headers[TOKEN_HEADER_KEY]
          : connection.context[TOKEN_HEADER_KEY],
      }),
      subscriptions: {
        'graphql-ws': true,
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          secure: configService.get<boolean>('SMTP_SECURE'),
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: configService.get<string>('EMAIL_FROM'),
        },
        template: {
          dir: join(__dirname, './templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
      tokenExpiration: parseInt(process.env.TOKEN_EXPIRATION),
      refreshTokenExpritation: parseInt(process.env.REFRESH_TOKEN_EXPIRATION),
    }),
    DatabaseModule,
    CommonModule,
    UserModule,
    MatchModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsRestGuard,
    },

    UserService,
  ],
})
export class AppModule implements NestModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
