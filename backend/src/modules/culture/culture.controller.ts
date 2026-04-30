import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CultureService } from './culture.service';
import { CreateCultureDto } from './dto/culture.dto';

@ApiTags('Cultures')
@Controller('cultures')
export class CultureController {
  constructor(private readonly cultureService: CultureService) {}

  @Post(':federationId')
  @ApiOperation({ summary: 'Créer une culture' })
  create(@Param('federationId') federationId: string, @Body() dto: CreateCultureDto) {
    return this.cultureService.create(federationId, dto);
  }

  @Get('federation/:federationId')
  @ApiOperation({ summary: 'Liste des cultures par fédération' })
  findAll(@Param('federationId') federationId: string) {
    return this.cultureService.findAllByFederation(federationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail culture' })
  findOne(@Param('id') id: string) {
    return this.cultureService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier culture' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateCultureDto>) {
    return this.cultureService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer culture' })
  remove(@Param('id') id: string) {
    return this.cultureService.remove(id);
  }
}