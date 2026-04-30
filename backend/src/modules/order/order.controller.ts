import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post(':federationId/:utilisateurId')
  @ApiOperation({ summary: 'Créer une commande' })
  create(
    @Param('federationId') federationId: string,
    @Param('utilisateurId') utilisateurId: string,
    @Body() dto: CreateOrderDto,
  ) {
    return this.orderService.create(federationId, utilisateurId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail commande' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Get('reference/:reference')
  @ApiOperation({ summary: 'Commande par référence' })
  findByReference(@Param('reference') reference: string) {
    return this.orderService.findByReference(reference);
  }

  @Get('utilisateur/:utilisateurId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Commandes d\'un utilisateur' })
  findByUtilisateur(@Param('utilisateurId') utilisateurId: string) {
    return this.orderService.findByUtilisateur(utilisateurId);
  }

  @Get('federation/:federationId')
  @ApiOperation({ summary: 'Commandes par federation' })
  findByFederation(@Param('federationId') federationId: string) {
    return this.orderService.findByFederation(federationId);
  }
}