import { Module } from '@nestjs/common';
import { EntidadesClientService } from './entidades-client.service';

@Module({
  providers: [EntidadesClientService],
  exports: [EntidadesClientService],
})
export class EntidadesClientModule {}
