import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { MatchResolver } from './match.resolver';

@Module({
  controllers: [MatchController],
  providers: [MatchService, MatchResolver]
})
export class MatchModule {}
