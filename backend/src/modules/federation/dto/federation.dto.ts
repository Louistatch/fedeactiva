import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateFederationDto {
  @ApiProperty({ example: 'Fédération Nationale des Maraîchers du Togo' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'fenomat' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Organisation faîtière des maraîchers' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://fenomat.tg/logo.png' })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({ example: '#1c4a2e' })
  @IsString()
  @IsOptional()
  couleurPrimaire?: string;

  @ApiProperty({ example: '#52b788' })
  @IsString()
  @IsOptional()
  couleurSecondaire?: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsOptional()
  commissionPercent?: number;

  @ApiProperty({ example: ['fenomat.tg', 'www.fenomat.tg'] })
  @IsArray()
  @IsOptional()
  domainesAutorises?: string[];

  @ApiProperty({ example: '+228 22 21 30 00' })
  @IsString()
  @IsOptional()
  telephone?: string;

  @ApiProperty({ example: 'admin@fenomat.tg' })
  @IsString()
  @IsOptional()
  email?: string;
}

export class UpdateFederationDto extends PartialType(CreateFederationDto) {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class FederationResponseDto {
  id: string;
  nom: string;
  slug: string;
  description: string;
  logoUrl: string;
  couleurPrimaire: string;
  couleurSecondaire: string;
  active: boolean;
  commissionPercent: number;
  domainesAutorises: string[];
}
