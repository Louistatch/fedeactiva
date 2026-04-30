import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, Min, Max, Matches, IsEmail, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFederationDto {
  @ApiProperty({ example: 'Fédération Nationale des Maraîchers du Togo' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom est requis' })
  nom: string;

  @ApiProperty({ example: 'fenomat' })
  @IsString({ message: 'Le slug doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le slug est requis' })
  @Matches(/^[a-z0-9-]+$/, { message: 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets' })
  slug: string;

  @ApiProperty({ example: 'Organisation faîtière des maraîchers' })
  @IsString({ message: 'La description doit être une chaîne de caractères' })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://fenomat.tg/logo.png' })
  @IsString({ message: 'L\'URL du logo doit être une chaîne de caractères' })
  @IsOptional()
  @Matches(/^https?:\/\/.+/, { message: 'L\'URL du logo doit être valide (http:// ou https://)' })
  logoUrl?: string;

  @ApiProperty({ example: '#1c4a2e' })
  @IsString({ message: 'La couleur primaire doit être une chaîne de caractères' })
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'La couleur primaire doit être au format hexadécimal (#RRGGBB)' })
  couleurPrimaire?: string;

  @ApiProperty({ example: '#52b788' })
  @IsString({ message: 'La couleur secondaire doit être une chaîne de caractères' })
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'La couleur secondaire doit être au format hexadécimal (#RRGGBB)' })
  couleurSecondaire?: string;

  @ApiProperty({ example: 10 })
  @IsNumber({}, { message: 'La commission doit être un nombre' })
  @IsOptional()
  @Min(0, { message: 'La commission doit être entre 0 et 100' })
  @Max(100, { message: 'La commission doit être entre 0 et 100' })
  commissionPercent?: number;

  @ApiProperty({ example: ['fenomat.tg', 'www.fenomat.tg'] })
  @IsArray({ message: 'Les domaines autorisés doivent être un tableau' })
  @IsOptional()
  @ArrayMinSize(1, { message: 'Au moins un domaine doit être spécifié' })
  @Matches(/^[a-z0-9.-]+\.[a-z]{2,}$/, { each: true, message: 'Format de domaine invalide (ex: example.com)' })
  domainesAutorises?: string[];

  @ApiProperty({ example: '+22822213000' })
  @IsString({ message: 'Le téléphone doit être une chaîne de caractères' })
  @IsOptional()
  @Matches(/^\+?[0-9]{8,15}$/, { message: 'Format de téléphone invalide (ex: +22822213000)' })
  telephone?: string;

  @ApiProperty({ example: 'admin@fenomat.tg' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsOptional()
  email?: string;
}
