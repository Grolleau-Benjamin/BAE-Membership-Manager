import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

/**
 * Controller for handling authentication-related operations.
 * 
 * This controller provides endpoints for user authentication, including login functionality.
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Endpoint for user login.
   * 
   * This method allows a user to sign in by providing a username and password.
   * The request body is validated using the `SignInDto`.
   * 
   * @param signInDto - The DTO containing the username and password for authentication.
   * @returns A JWT token or an appropriate response from the AuthService.
   */
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}
