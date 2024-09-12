import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/schemas/users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService, 
    private jwtService: JwtService
  ) {}

  /**
   * Authenticates the user and returns a JWT token.
   * 
   * @param username - The username of the user.
   * @param password - The user's password.
   * @returns A JWT access token.
   * @throws UnauthorizedException if the credentials are invalid.
   */
  async signIn(username: string, password: string) {
    const user: User = await this.userService.findOne(username); 

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: (user as any)._id, username: user.username }; 

    return {
      login: true, 
      role: user.role, 
      username: user.username, 
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
