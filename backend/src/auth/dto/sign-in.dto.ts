import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Data Transfer Object (DTO) for user sign-in.
 */
export class SignInDto {
  
  /**
   * The username of the user attempting to sign in.
   * This field is required and must be a valid string.
   */
  @IsString()
  @IsNotEmpty()
  username: string;

  /**
   * The password of the user attempting to sign in.
   * This field is required and must be a valid string.
   */
  @IsString()
  @IsNotEmpty()
  password: string;
}

