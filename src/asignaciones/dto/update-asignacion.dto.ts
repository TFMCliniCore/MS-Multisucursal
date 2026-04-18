import { IsInt, IsPositive, IsBoolean, IsOptional } from 'class-validator';

export class UpdateAsignacionDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  rolId?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
