import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCultureDto {
  @ApiProperty({ example: 'Tomate' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'Culture de tomate de plein champ' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '🍅' })
  @IsString()
  @IsOptional()
  icone?: string;
}
