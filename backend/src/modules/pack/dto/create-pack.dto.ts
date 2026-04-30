import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePackDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  cultureId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  cantonId: number;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @IsOptional()
  prixUnitaire?: number;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsOptional()
  stockTotal?: number;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsOptional()
  stockDisponible?: number;

  @ApiProperty({ example: 'Campagne 2025-2026' })
  @IsString()
  @IsOptional()
  campagne?: string;

  @ApiProperty({ example: 1200 })
  @IsNumber()
  @IsOptional()
  rendementEstime?: number;

  @ApiProperty({ example: '2025-01-01' })
  @IsString()
  @IsOptional()
  dateDebutValidite?: string;

  @ApiProperty({ example: '2025-12-31' })
  @IsString()
  @IsOptional()
  dateFinValidite?: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  modeleExcelId?: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  modeleWordId?: string;
}
