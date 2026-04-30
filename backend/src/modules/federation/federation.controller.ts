import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FederationService } from './federation.service';
import { CreateFederationDto, UpdateFederationDto } from './dto/federation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesEnum } from '../auth/guards/roles.enum';

@ApiTags('Federations')
@Controller('federations')
export class FederationController {
  constructor(private readonly federationService: FederationService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une fédération' })
  create(@Body() dto: CreateFederationDto) {
    return this.federationService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Liste des fédérations' })
  findAll() {
    return this.federationService.findAll();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Statistiques fédérations' })
  getStats() {
    return this.federationService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail Fédération' })
  findOne(@Param('id') id: string) {
    return this.federationService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Détail Fédération par slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.federationService.findBySlug(slug);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier Fédération' })
  update(@Param('id') id: string, @Body() dto: UpdateFederationDto) {
    return this.federationService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer Fédération' })
  remove(@Param('id') id: string) {
    return this.federationService.remove(id);
  }

  @Put(':id/regenerate-key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Régénérer API key' })
  regenerateApiKey(@Param('id') id: string) {
    return this.federationService.regenerateApiKey(id);
  }
}
