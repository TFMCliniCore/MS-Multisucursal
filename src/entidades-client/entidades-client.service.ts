import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';

export interface UsuarioRemoto {
  id: number;
  nombres: string;
  email: string;
  cargo: string;
}

export interface SucursalRemota {
  id: number;
  nombre: string;
  direccion: string;
}

export interface RolRemoto {
  id: number;
  nombre: string;
}

@Injectable()
export class EntidadesClientService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.MS_ENTIDADES_CORE_URL ?? 'http://ms-entidades:3001/api/v1';
  }

  async getUsuario(id: number): Promise<UsuarioRemoto> {
    const res = await fetch(`${this.baseUrl}/usuarios/${id}`);
    if (res.status === 404) throw new NotFoundException(`Usuario ${id} no encontrado en MS Entidades.`);
    if (!res.ok) throw new InternalServerErrorException(`Error MS Entidades al obtener usuario: ${res.status}`);
    return res.json() as Promise<UsuarioRemoto>;
  }

  async getSucursal(id: number): Promise<SucursalRemota> {
    const res = await fetch(`${this.baseUrl}/sucursales/${id}`);
    if (res.status === 404) throw new NotFoundException(`Sucursal ${id} no encontrada en MS Entidades.`);
    if (!res.ok) throw new InternalServerErrorException(`Error MS Entidades al obtener sucursal: ${res.status}`);
    return res.json() as Promise<SucursalRemota>;
  }

  async getRol(id: number): Promise<RolRemoto> {
    const res = await fetch(`${this.baseUrl}/roles/${id}`);
    if (res.status === 404) throw new NotFoundException(`Rol ${id} no encontrado en MS Entidades.`);
    if (!res.ok) throw new InternalServerErrorException(`Error MS Entidades al obtener rol: ${res.status}`);
    return res.json() as Promise<RolRemoto>;
  }

  async getUsuariosByIds(ids: number[]): Promise<Map<number, UsuarioRemoto>> {
    if (ids.length === 0) return new Map();
    const res = await fetch(`${this.baseUrl}/usuarios`);
    if (!res.ok) throw new InternalServerErrorException(`Error MS Entidades al obtener usuarios: ${res.status}`);
    const all = await res.json() as UsuarioRemoto[];
    const idSet = new Set(ids);
    return new Map(all.filter(u => idSet.has(u.id)).map(u => [u.id, u]));
  }

  async getSucursalesByIds(ids: number[]): Promise<Map<number, SucursalRemota>> {
    if (ids.length === 0) return new Map();
    const res = await fetch(`${this.baseUrl}/sucursales`);
    if (!res.ok) throw new InternalServerErrorException(`Error MS Entidades al obtener sucursales: ${res.status}`);
    const all = await res.json() as SucursalRemota[];
    const idSet = new Set(ids);
    return new Map(all.filter(s => idSet.has(s.id)).map(s => [s.id, s]));
  }

  async getRolesByIds(ids: number[]): Promise<Map<number, RolRemoto>> {
    if (ids.length === 0) return new Map();
    const res = await fetch(`${this.baseUrl}/roles`);
    if (!res.ok) throw new InternalServerErrorException(`Error MS Entidades al obtener roles: ${res.status}`);
    const all = await res.json() as RolRemoto[];
    const idSet = new Set(ids);
    return new Map(all.filter(r => idSet.has(r.id)).map(r => [r.id, r]));
  }
}
