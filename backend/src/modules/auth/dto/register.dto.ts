import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'AMETSITSI' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom est requis' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  nom: string;

  @ApiProperty({ example: 'Koffi' })
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le prénom est requis' })
  @MinLength(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
  prenom: string;

  @ApiProperty({ example: '+22890123456' })
  @IsString({ message: 'Le téléphone doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le téléphone est requis' })
  @Matches(/^\+?[0-9]{8,15}$/, { message: 'Format de téléphone invalide (ex: +22890123456)' })
  telephone: string;

  @ApiProperty({ example: 'koffi@email.tg', required: false })
  @IsEmail({}, { message: 'Email invalide' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'password123' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
    message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre' 
  })
  password: string;

  @ApiProperty({ example: 'uuid-federation', required: false })
  @IsString()
  @IsOptional()
  federation_id?: string;
}
