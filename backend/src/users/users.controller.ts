import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Roles(['admin'])
@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Creates a new user.
   * @param user - The authenticated user making the request.
   * @param createUserDto - The DTO containing new user data.
   */
  @Post()
  async createUser(@Req() { user }, @Body() createUserDto: CreateUserDto) {
    const currentUser = await this.usersService.findOneById(user.sub); 
    this.usersService.logger(
      user.sub, user.username, currentUser.role, `POST /users for user ${createUserDto.username}`
    );
    return this.usersService.createUser(createUserDto);
  }

  /**
   * Updates an existing user by ID.
   * @param user - The authenticated user making the request.
   * @param id - The ID of the user to update.
   * @param updateUserDto - The DTO containing updated user data.
   */
  @Patch(':id')
  async updateUser(@Req() { user }, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const currentUser = await this.usersService.findOneById(user.sub); 
    this.usersService.logger(
      user.sub, user.username, currentUser.role, `PATCH /users for user #${id}`
    );
    return this.usersService.updateUser(id, updateUserDto);
  }

  /**
   * Retrieves all users.
   * @param user - The authenticated user making the request.
   * @returns A list of all users.
   */
  @Get()
  async getAllUsers(@Req() { user }) {
    const currentUser = await this.usersService.findOneById(user.sub); 
    this.usersService.logger(
      user.sub, user.username, currentUser.role, "GET /users"
    );
    return this.usersService.getAllUsers();
  }

  /**
   * Retrieves a user by ID.
   * @param user - The authenticated user making the request.
   * @param id - The ID of the user to retrieve.
   * @returns The user with the given ID.
   */
  @Get(':id')
  async getUserByID(@Req() { user }, @Param('id') id: string) {
    const currentUser = await this.usersService.findOneById(user.sub); 
    this.usersService.logger(
      user.sub, user.username, currentUser.role, `GET /users/${id}`
    );
    return this.usersService.findOneById(id);
  }

  /**
   * Deletes a user by ID.
   * @param user - The authenticated user making the request.
   * @param id - The ID of the user to delete.
   */
  @Delete(':id')
  async deleteById(@Req() { user }, @Param('id') id: string) {
    const currentUser = await this.usersService.findOneById(user.sub); 
    this.usersService.logger(
      user.sub, user.username, currentUser.role, `DELETE /users/${id}`
    );

    return this.usersService.deleteById(id);
  }
}
