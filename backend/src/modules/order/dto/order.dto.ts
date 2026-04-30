import { IsUUID, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  @IsUUID()
  packId: string;

  @ApiProperty({ default: 1 })
  @IsNumber()
  @IsOptional()
  quantite?: number;
}