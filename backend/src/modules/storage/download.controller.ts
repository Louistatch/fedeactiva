import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { DownloadService } from './download.service';

@ApiTags('Download')
@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Get('generate/:ligneCommandeId/:typeFichier')
  @ApiOperation({ summary: 'Générer un token de téléchargement' })
  generateToken(
    @Param('ligneCommandeId') ligneCommandeId: string,
    @Param('typeFichier') typeFichier: 'excel' | 'word',
  ) {
    return this.downloadService.generateToken(ligneCommandeId, typeFichier);
  }

  @Get(':token')
  @ApiOperation({ summary: 'Télécharger un fichier via token' })
  async download(
    @Param('token') token: string,
    @Res() res: Response,
  ) {
    const { stream, filename, mimeType } = await this.downloadService.getFileByToken(token);
    
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    stream.pipe(res);
  }
}