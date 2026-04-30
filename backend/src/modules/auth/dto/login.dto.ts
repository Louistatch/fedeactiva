import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@fenomat.tg', required: false })
  @IsEmail({}, { message: 'Email invalide' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+22890123456', required: false })
  @IsString()
  @IsOptional()
  telephone?: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;
}
