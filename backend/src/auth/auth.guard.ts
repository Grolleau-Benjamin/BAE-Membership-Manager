import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

/**
 * Authentication Guard to protect routes using JWT.
 * 
 * This guard checks for a valid JWT in the Authorization header of incoming requests.
 * If the token is valid, the request proceeds, otherwise, an UnauthorizedException is thrown.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  /**
   * Determines whether a request can activate a route by validating the JWT.
   * 
   * @param context - The execution context, providing access to the request object.
   * @returns A boolean indicating if the request is authenticated.
   * @throws UnauthorizedException if the token is invalid or missing.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    
    // If no token is found, throw UnauthorizedException
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      
      // Attach the payload (user data) to the request object
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    
    return true;
  }

  /**
   * Extracts the JWT token from the Authorization header.
   * 
   * @param request - The incoming HTTP request object.
   * @returns The extracted token, or undefined if the header is missing or malformed.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
