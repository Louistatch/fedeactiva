import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CantonService } from './canton.service';

@ApiTags('Cantons')
@Controller('cantons')
export class CantonController {
  constructor(private readonly cantonService: CantonService) {}

  @Get('regions')
  @ApiOperation({ summary: 'Liste des régions' })
  getAllRegions() {
    return this.cantonService.getAllRegions();
  }

  @Get('regions/:regionId/prefectures')
  @ApiOperation({ summary: 'Préfectures par région' })
  getPrefecturesByRegion(@Param('regionId') regionId: number) {
    return this.cantonService.getPrefecturesByRegion(regionId);
  }

  @Get('prefectures/:prefectureId/cantons')
  @ApiOperation({ summary: 'Cantons par préfecture' })
  getCantonsByPrefecture(@Param('prefectureId') prefectureId: number) {
    return this.cantonService.getCantonsByPrefecture(prefectureId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail canton' })
  getCanton(@Param('id') id: number) {
    return this.cantonService.getCanton(id);
  }

  @Get()
  @ApiOperation({ summary: 'Tous les cantons' })
  getAllCantons() {
    return this.cantonService.getAllCantons();
  }
}