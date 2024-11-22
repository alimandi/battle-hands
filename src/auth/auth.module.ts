import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PasswordCheckService } from './password-check.service';
import { DatabaseModule } from 'src/database/database.module';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [DatabaseModule],
  providers: [AuthResolver, AuthService, PasswordCheckService],
  exports: [PasswordCheckService],
})
export class AuthModule {}
