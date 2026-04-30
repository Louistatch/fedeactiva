import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationService } from './notification.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('utilisateur/:utilisateurId')
  @ApiOperation({ summary: 'Notifications d\'un utilisateur' })
  getByUtilisateur(@Param('utilisateurId') utilisateurId: string) {
    return this.notificationService.getByUtilisateur(utilisateurId);
  }
}