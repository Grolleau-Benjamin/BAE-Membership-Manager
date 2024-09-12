import { IsString, IsNotEmpty, IsOptional, IsDate, IsNumber } from "class-validator";
import { Type } from "class-transformer"; 

/**
 * Data Transfer Object (DTO) for creating a new adherent.
 */
export class CreateAdherentDto {

  /**
   * The name of the adherent.
   * This field is required and must be a string.
   */
  @IsNotEmpty({ message: 'Name field is required.' })
  @IsString()
  name: string;
  
  /**
   * The first name of the adherent.
   * This field is required and must be a string.
   */
  @IsNotEmpty({ message: 'Firstname field is required.' })
  @IsString()
  firstname: string;

  /**
   * The date of adherence.
   * This field is optional and must be a valid date if provided.
   * If not provided, the current date will be used in the service logic.
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateAdherence?: Date;

  /**
   * The number of years of adherence.
   * This field is optional and must be a number if provided.
   * If not provided, the default will be set to 1 in the service logic.
   */
  @IsOptional()
  @IsNumber()
  nbYears?: number;
}
