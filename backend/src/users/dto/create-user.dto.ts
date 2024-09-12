import { IsString, IsIn, IsNotEmpty, IsOptional } from "class-validator";

/**
 * DTO for creating a new user.
 */
export class CreateUserDto {

  /**
   * The username of the user.
   * This field is required.
   */
  @IsNotEmpty({ message: 'Username field is required.' })
  @IsString()
  username: string;

  /**
   * The password for the user.
   * This field is optional.
   */
  @IsOptional()
  @IsString()
  password?: string;

  /**
   * The role of the user.
   * Must be either 'admin' or 'user'.
   * This field is optional.
   */
  @IsOptional()
  @IsIn(['admin', 'user'], { message: 'Role must be either admin or user.' })
  role?: "admin" | "user";
}
