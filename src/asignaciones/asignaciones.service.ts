import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EntidadesClientService } from '../entidades-client/entidades-client.service';
import { CreateAsignacionDto } from './dto/create-asignacion.dto';
import { UpdateAsignacionDto } from './dto/update-asignacion.dto';

@Injectable()
export class AsignacionesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entidadesClient: EntidadesClientService,
  ) {}

  async create(dto: CreateAsignacionDto) {
    const [usuario, sucursal, rol] = await Promise.all([
      this.entidadesClient.getUsuario(dto.usuarioId),
      this.entidadesClient.getSucursal(dto.sucursalId),
      this.entidadesClient.getRol(dto.rolId),
    ]);

    const asignacion = await this.prisma.asignacionUsuarioSucursal.create({
      data: {
        usuarioId: dto.usuarioId,
        sucursalId: dto.sucursalId,
        rolId: dto.rolId,
        isActive: dto.isActive ?? true,
      },
    });

    return this.enrich(asignacion, usuario, sucursal, rol);
  }

  async findAll(filters?: { usuarioId?: number; sucursalId?: number; isActive?: boolean }) {
    const where: Record<string, unknown> = {};
    if (filters?.usuarioId) where.usuarioId = filters.usuarioId;
    if (filters?.sucursalId) where.sucursalId = filters.sucursalId;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;

    const asignaciones = await this.prisma.asignacionUsuarioSucursal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    if (asignaciones.length === 0) return [];

    const usuarioIds: number[] = Array.from(new Set<number>(asignaciones.map(a => a.usuarioId)));
    const sucursalIds: number[] = Array.from(new Set<number>(asignaciones.map(a => a.sucursalId)));
    const rolIds: number[] = Array.from(new Set<number>(asignaciones.map(a => a.rolId)));

    const [usuarios, sucursales, roles] = await Promise.all([
      this.entidadesClient.getUsuariosByIds(usuarioIds),
      this.entidadesClient.getSucursalesByIds(sucursalIds),
      this.entidadesClient.getRolesByIds(rolIds),
    ]);

    return asignaciones.map(a =>
      this.enrich(a, usuarios.get(a.usuarioId), sucursales.get(a.sucursalId), roles.get(a.rolId)),
    );
  }

  async findOne(id: number) {
    const asignacion = await this.prisma.asignacionUsuarioSucursal.findUniqueOrThrow({
      where: { id },
    });

    const [usuario, sucursal, rol] = await Promise.all([
      this.entidadesClient.getUsuario(asignacion.usuarioId),
      this.entidadesClient.getSucursal(asignacion.sucursalId),
      this.entidadesClient.getRol(asignacion.rolId),
    ]);

    return this.enrich(asignacion, usuario, sucursal, rol);
  }

  async findByUsuario(usuarioId: number) {
    return this.findAll({ usuarioId });
  }

  async findBySucursal(sucursalId: number) {
    return this.findAll({ sucursalId });
  }

  async update(id: number, dto: UpdateAsignacionDto) {
    if (dto.rolId) {
      await this.entidadesClient.getRol(dto.rolId);
    }

    const asignacion = await this.prisma.asignacionUsuarioSucursal.update({
      where: { id },
      data: dto,
    });

    const [usuario, sucursal, rol] = await Promise.all([
      this.entidadesClient.getUsuario(asignacion.usuarioId),
      this.entidadesClient.getSucursal(asignacion.sucursalId),
      this.entidadesClient.getRol(asignacion.rolId),
    ]);

    return this.enrich(asignacion, usuario, sucursal, rol);
  }

  async remove(id: number) {
    return this.prisma.asignacionUsuarioSucursal.delete({ where: { id } });
  }

  private enrich(asignacion: any, usuario: any, sucursal: any, rol: any) {
    return {
      id: asignacion.id,
      isActive: asignacion.isActive,
      createdAt: asignacion.createdAt,
      updatedAt: asignacion.updatedAt,
      usuario: usuario
        ? { id: usuario.id, nombres: usuario.nombres, email: usuario.email }
        : { id: asignacion.usuarioId },
      sucursal: sucursal
        ? { id: sucursal.id, nombre: sucursal.nombre }
        : { id: asignacion.sucursalId },
      rol: rol
        ? { id: rol.id, nombre: rol.nombre }
        : { id: asignacion.rolId },
    };
  }
}
