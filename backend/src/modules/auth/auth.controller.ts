import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 tentatives par minute
  @ApiOperation({ summary: 'Connexion unifiée (Super-Admin, Admin-Fédération, Producteur)' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 inscriptions par minute
  @ApiOperation({ summary: 'Inscription Producteur' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.registerProducteur(
      dto.federation_id || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      dto,
    );
  }

  @Post('login-sa')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Connexion Super-Admin (legacy)' })
  async loginSuperAdmin(@Body() dto: LoginDto) {
    return this.authService.loginSuperAdmin(dto);
  }

  @Post('login-fed/:slug')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Connexion Admin-Fédération (legacy)' })
  async loginAdminFederation(
    @Body() dto: LoginDto,
    @Req() req: Request & { headers: { 'x-federation-slug'?: string } },
  ) {
    const slug = req.headers['x-federation-slug'] || 'fenomat';
    return this.authService.loginAdminFederation(slug, dto);
  }

  @Post('login-producteur/:federationId')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Connexion Producteur (legacy)' })
  async loginProducteur(
    @Body() dto: LoginDto,
  ) {
    // Default federation for demo
    return this.authService.loginProducteur('a1b2c3d4-e5f6-7890-abcd-ef1234567890', dto);
  }

  @Post('register-producteur/:federationId')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Inscription Producteur (legacy)' })
  async registerProducteur(@Body() dto: RegisterDto) {
    return this.authService.registerProducteur(
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      dto,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Utilisateur connecté' })
  async getMe(@Req() req: Request & { user: any }) {
    return req.user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Déconnexion' })
  async logout() {
    return { message: 'Déconnexion réussie' };
  }
}
