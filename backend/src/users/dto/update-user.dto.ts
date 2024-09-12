import { IsOptional, IsString, IsIn } from "class-validator";

/**
 * DTO for updating an existing user.
 */
export class UpdateUserDto {

  /**
   * The updated username for the user.
   * This field is optional.
   */
  @IsOptional()
  @IsString()
  username?: string;

  /**
   * The updated password for the user.
   * This field is optional.
   */
  @IsOptional()
  @IsString()
  password?: string;

  /**
   * The updated role for the user.
   * Must be either 'admin' or 'user'.
   * This field is optional.
   */
  @IsOptional()
  @IsIn(["admin", "user"], { message: 'Role must be either admin or user.' })
  role?: "admin" | "user";
}
