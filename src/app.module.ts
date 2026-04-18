import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AsignacionesModule } from './asignaciones/asignaciones.module';

@Module({
  imports: [PrismaModule, AsignacionesModule],
})
export class AppModule {}
