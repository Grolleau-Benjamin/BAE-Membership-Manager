import { HttpException, NotFoundException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  /**
   * Logs user activity with basic information.
   * 
   * @param sub - The user ID.
   * @param username - The username.
   * @param role - The user's role.
   * @param path - The API path accessed.
   */
  logger(sub: string, username: string, role: string | null, path: string) {
    console.log(`[#${sub}] ${username} (role: ${role}) => ${path}`);
  }

  /**
   * Generates a random password with 20 characters.
   * 
   * @returns A randomly generated password.
   */
  generatePassword(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 20; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }

    return password;
  }

  /**
   * Creates a new user.
   * 
   * @param createUserDto - The DTO containing user data.
   * @returns The created user, a flag indicating if the password was auto-generated, and the password itself.
   */
  async createUser(createUserDto: CreateUserDto): Promise<{user: User, randomPassword: boolean, password: string}> {
    if (!createUserDto.username) {
      throw new HttpException("Username field is required.", HttpStatus.BAD_REQUEST);
    }
    
    const existingUser = await this.userModel.findOne({ username: createUserDto.username }).exec();
    if (existingUser) {
      throw new HttpException(`User ${createUserDto.username} already exists`, HttpStatus.BAD_REQUEST);
    }
    
    let generatedPassword = '';
    if (!createUserDto.password) {
      generatedPassword = this.generatePassword();
      createUserDto.password = generatedPassword;
    }
    
    if (!createUserDto.role) {
      createUserDto.role = "user";
    }
    
    const createdUser = await new this.userModel(createUserDto).save();
    
    return {
      user: createdUser,
      randomPassword: generatedPassword !== '',
      password: generatedPassword || 'Password provided by user',
    };
  }

  /**
   * Updates an existing user by ID.
   * 
   * @param userId - The ID of the user to update.
   * @param updateUserDto - The DTO containing updated user data.
   * @returns The updated user.
   */
  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userModel.findByIdAndUpdate(
      userId, 
      updateUserDto, 
      { new: true }
    ).select('-password');

    if (!existingUser) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    return existingUser;
  }

  /**
   * Retrieves all users.
   * 
   * @returns A list of all users.
   */
  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  /**
   * Finds a user by username.
   * 
   * @param username - The username to search for.
   * @returns The user with the given username.
   * @throws HttpException if the user is not found.
   */
  async findOne(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  /**
   * Finds a user by ID.
   * 
   * @param id - The ID of the user to retrieve.
   * @returns The user with the given ID.
   * @throws HttpException if the user is not found or the ID format is invalid.
   */
  async findOneById(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new HttpException(`User ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  /**
   * Deletes a user by ID.
   * 
   * @param id - The ID of the user to delete.
   * @returns The deleted user.
   * @throws HttpException if the user is not found.
   */
  async deleteById(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).select('-password').exec();

    if (!deletedUser) {
      throw new HttpException(`User #${id} not found`, HttpStatus.NOT_FOUND);
    }

    return deletedUser;
  }
}
