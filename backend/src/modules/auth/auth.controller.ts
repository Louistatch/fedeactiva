import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Connexion unifiée (Super-Admin, Admin-Fédération, Producteur)' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Inscription Producteur' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.registerProducteur(
      dto.federation_id || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      dto,
    );
  }

  @Post('login-sa')
  @ApiOperation({ summary: 'Connexion Super-Admin (legacy)' })
  async loginSuperAdmin(@Body() dto: LoginDto) {
    return this.authService.loginSuperAdmin(dto);
  }

  @Post('login-fed/:slug')
  @ApiOperation({ summary: 'Connexion Admin-Fédération (legacy)' })
  async loginAdminFederation(
    @Body() dto: LoginDto,
    @Req() req: Request & { headers: { 'x-federation-slug'?: string } },
  ) {
    const slug = req.headers['x-federation-slug'] || 'fenomat';
    return this.authService.loginAdminFederation(slug, dto);
  }

  @Post('login-producteur/:federationId')
  @ApiOperation({ summary: 'Connexion Producteur (legacy)' })
  async loginProducteur(
    @Body() dto: LoginDto,
  ) {
    // Default federation for demo
    return this.authService.loginProducteur('a1b2c3d4-e5f6-7890-abcd-ef1234567890', dto);
  }

  @Post('register-producteur/:federationId')
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
