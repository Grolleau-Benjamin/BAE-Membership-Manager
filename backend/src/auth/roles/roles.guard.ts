import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector, 
    private userService: UsersService
  ) {}

  /**
   * Checks if the user has the required roles to access the route.
   * 
   * @param context - The execution context of the request.
   * @returns `true` if the user has the required roles, otherwise `false`.
   */
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requiredRoles = this.reflector.getAllAndOverride(
      ROLES_KEY, 
      [context.getClass(), context.getHandler()]
    );

    // If no specific roles are required, allow access
    if (!requiredRoles) { 
      return true; 
    }

    const user = await this.userService.findOneById(request.user.sub);
    const userRole = user.role;

    // Check if the user has one of the required roles
    return requiredRoles.some((role: string) => role === userRole);
  }
}
