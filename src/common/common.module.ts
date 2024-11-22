import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ObjectIdScalar } from './scalar/ObjectIdScalar';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [ObjectIdScalar],
})
export class CommonModule {}
