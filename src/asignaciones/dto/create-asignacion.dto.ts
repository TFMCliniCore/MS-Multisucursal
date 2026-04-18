import { IsInt, IsPositive, IsBoolean, IsOptional } from 'class-validator';

export class CreateAsignacionDto {
  @IsInt()
  @IsPositive()
  usuarioId: number;

  @IsInt()
  @IsPositive()
  sucursalId: number;

  @IsInt()
  @IsPositive()
  rolId: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
