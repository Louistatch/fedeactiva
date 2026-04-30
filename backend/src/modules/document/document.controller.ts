import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@ApiTags('Documents')
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload-modele')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Uploader un modèle de document' })
  uploadModele(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { federationId: string; cultureId: string; typeDocument: 'excel' | 'word'; cantonId?: number },
  ) {
    return this.documentService.uploadModele(
      body.federationId,
      body.cultureId,
      body.typeDocument,
      file,
      body.cantonId,
    );
  }

  @Get('modeles/:federationId')
  @ApiOperation({ summary: 'Liste des modèles' })
  getModeles(
    @Param('federationId') federationId: string,
    @Body('cultureId') cultureId?: string,
  ) {
    return this.documentService.getModeles(federationId, cultureId);
  }

  @Get('generate/:ligneCommandeId')
  @ApiOperation({ summary: 'Générer les documents pour une ligne de commande' })
  generateDocuments(@Param('ligneCommandeId') ligneCommandeId: string) {
    return this.documentService.generateDocuments(ligneCommandeId);
  }
}