import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { MatchResolver } from './match.resolver';
import { DatabaseModule } from 'src/database/database.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [MatchController],
  providers: [MatchService, MatchResolver],
})
export class MatchModule {}
