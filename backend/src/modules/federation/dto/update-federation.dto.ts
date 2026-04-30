import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFederationDto } from './create-federation.dto';

export class UpdateFederationDto extends PartialType(CreateFederationDto) {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
