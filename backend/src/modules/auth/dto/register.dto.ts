import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ example: 'uuid-federation', required: false })
  @IsString()
  @IsOptional()
  federation_id?: string;
}
