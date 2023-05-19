import { Body, Controller, Post, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, LoginEmailDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  createUser(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('login')
  login(@Body() loginEmailDto: LoginEmailDto) {
    return this.authService.login(loginEmailDto);
  }
}
