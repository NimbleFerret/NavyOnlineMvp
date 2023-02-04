import { SignUpRequest } from '@app/shared-library/gprc/grpc.user.service';
import { Controller, Request, Get, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) { }

  @Post('auth/signIn')
  async login(@Request() req) {
    return this.authService.signIn(req.email, req.password);
  }

  @Post('auth/signUp')
  signUp(@Body() signUpRequest: SignUpRequest) {
    return this.authService.signUp(signUpRequest);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return 'Profile test';
  }

}
