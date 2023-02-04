import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

export interface IssueTokenDto {
  email: string;
  password: string;
}

export interface VerifyTokenDto {
  token: string;
}

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) { }

  @Post('token/issue')
  async issueToken(@Body() dto: IssueTokenDto) {
    return this.authService.issueAuthTokenForUser(dto.email, dto.password);
  }

  @Post('token/verify')
  async verifyToken(@Body() dto: VerifyTokenDto) {
    return this.authService.verifyAuthToken(dto.token);
  }

}
