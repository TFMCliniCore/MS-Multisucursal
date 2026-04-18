import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AsignacionesService } from './asignaciones.service';
import { CreateAsignacionDto } from './dto/create-asignacion.dto';
import { UpdateAsignacionDto } from './dto/update-asignacion.dto';

@Controller('asignaciones')
export class AsignacionesController {
  constructor(private readonly asignacionesService: AsignacionesService) {}

  @Post()
  create(@Body() dto: CreateAsignacionDto) {
    return this.asignacionesService.create(dto);
  }

  @Get()
  findAll(
    @Query('usuarioId') usuarioId?: string,
    @Query('sucursalId') sucursalId?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.asignacionesService.findAll({
      usuarioId: usuarioId ? Number(usuarioId) : undefined,
      sucursalId: sucursalId ? Number(sucursalId) : undefined,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    });
  }

  @Get('usuario/:usuarioId')
  findByUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.asignacionesService.findByUsuario(usuarioId);
  }

  @Get('sucursal/:sucursalId')
  findBySucursal(@Param('sucursalId', ParseIntPipe) sucursalId: number) {
    return this.asignacionesService.findBySucursal(sucursalId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.asignacionesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAsignacionDto) {
    return this.asignacionesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.asignacionesService.remove(id);
  }
}
