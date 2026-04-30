import { Controller, Get, Put, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil utilisateur connecté' })
  getMe(@Body('userId') userId: string) {
    return this.userService.findById(userId);
  }

  @Get('federation/:federationId')
  @ApiOperation({ summary: 'Liste utilisateurs par federation' })
  findByFederation(@Param('federationId') federationId: string) {
    return this.userService.findByFederation(federationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail utilisateur' })
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier profil' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.userService.update(id, data);
  }

  @Post(':id/change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Changer mot de passe' })
  changePassword(
    @Param('id') id: string,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return this.userService.changePassword(id, body.currentPassword, body.newPassword);
  }
}