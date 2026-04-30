import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePackDto {
  @ApiProperty()
  @IsUUID('4', { message: 'ID de culture invalide' })
  @IsNotEmpty({ message: 'La culture est requise' })
  cultureId: string;

  @ApiProperty()
  @IsNumber({}, { message: 'ID de canton invalide' })
  @IsNotEmpty({ message: 'Le canton est requis' })
  @Min(1, { message: 'ID de canton doit être positif' })
  cantonId: number;

  @ApiProperty({ example: 500 })
  @IsNumber({}, { message: 'Le prix doit être un nombre' })
  @IsOptional()
  @Min(0, { message: 'Le prix doit être positif' })
  @Max(1000000, { message: 'Le prix ne peut pas dépasser 1 000 000' })
  prixUnitaire?: number;

  @ApiProperty({ example: 1000 })
  @IsNumber({}, { message: 'Le stock total doit être un nombre' })
  @IsOptional()
  @Min(0, { message: 'Le stock total doit être positif' })
  @Max(999999, { message: 'Le stock total ne peut pas dépasser 999 999' })
  stockTotal?: number;

  @ApiProperty({ example: 1000 })
  @IsNumber({}, { message: 'Le stock disponible doit être un nombre' })
  @IsOptional()
  @Min(0, { message: 'Le stock disponible doit être positif' })
  stockDisponible?: number;

  @ApiProperty({ example: 'Campagne 2025-2026' })
  @IsString({ message: 'La campagne doit être une chaîne de caractères' })
  @IsOptional()
  campagne?: string;

  @ApiProperty({ example: 1200 })
  @IsNumber({}, { message: 'Le rendement estimé doit être un nombre' })
  @IsOptional()
  @Min(0, { message: 'Le rendement estimé doit être positif' })
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
  @IsUUID('4', { message: 'ID de modèle Excel invalide' })
  @IsOptional()
  modeleExcelId?: string;

  @ApiProperty()
  @IsUUID('4', { message: 'ID de modèle Word invalide' })
  @IsOptional()
  modeleWordId?: string;
}
