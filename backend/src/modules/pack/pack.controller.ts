import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PackService } from './pack.service';
import { CreatePackDto } from './dto/pack.dto';

@ApiTags('Packs')
@Controller('packs')
export class PackController {
  constructor(private readonly packService: PackService) {}

  @Post(':federationId')
  @ApiOperation({ summary: 'Créer un pack' })
  create(@Param('federationId') federationId: string, @Body() dto: CreatePackDto) {
    return this.packService.create(federationId, dto);
  }

  @Get('federation/:federationId')
  @ApiOperation({ summary: 'Liste des packs par federation (paginée)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  findAll(
    @Param('federationId') federationId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.packService.findAll(federationId, page, limit);
  }

  @Get('federation/:federationId/published')
  @ApiOperation({ summary: 'Packs publiés (public, paginée)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  findAllPublished(
    @Param('federationId') federationId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.packService.findAllPublished(federationId, page, limit);
  }

  @Get('slug/:slug/culture/:cultureId/canton/:cantonId')
  @ApiOperation({ summary: 'Pack par culture et canton' })
  findBySlug(
    @Param('slug') slug: string,
    @Param('cultureId') cultureId: string,
    @Param('cantonId') cantonId: number,
  ) {
    return this.packService.findBySlug(slug, cultureId, cantonId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail pack' })
  findOne(@Param('id') id: string) {
    return this.packService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier pack' })
  update(@Param('id') id: string, @Body() dto: Partial<CreatePackDto>) {
    return this.packService.update(id, dto);
  }

  @Put(':id/publish')
  @ApiOperation({ summary: 'Publier pack' })
  publish(@Param('id') id: string) {
    return this.packService.publish(id);
  }

  @Put(':id/archive')
  @ApiOperation({ summary: 'Archiver pack' })
  archive(@Param('id') id: string) {
    return this.packService.archive(id);
  }

  @Get('stats/:federationId')
  @ApiOperation({ summary: 'Statistiques packs' })
  getStats(@Param('federationId') federationId: string) {
    return this.packService.getStats(federationId);
  }
}