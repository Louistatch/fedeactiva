import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@fenomat.tg' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'AMETSITSI' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'Koffi' })
  @IsString()
  @IsNotEmpty()
  prenom: string;

  @ApiProperty({ example: '+228 90 12 34 56' })
  @IsString()
  @IsNotEmpty()
  telephone: string;

  @ApiProperty({ example: 'koffi@email.tg', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
