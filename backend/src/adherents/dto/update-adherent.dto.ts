import { IsString, IsOptional, IsDate, IsNumber } from "class-validator";
import { Type } from 'class-transformer';

/**
 * Data Transfer Object (DTO) for updating an existing adherent.
 */
export class UpdateAdherentDto {

  /**
   * The name of the adherent.
   * This field is optional and must be a string if provided.
   */
  @IsOptional()
  @IsString()
  name?: string;
  
  /**
   * The first name of the adherent.
   * This field is optional and must be a string if provided.
   */
  @IsOptional()
  @IsString()
  firstname?: string;

  /**
   * The date of adherence.
   * This field is optional and must be a valid date if provided.
   * It will be automatically transformed into a Date object if provided.
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateAdherence?: Date;

  /**
   * The number of years of adherence.
   * This field is optional and must be a number if provided.
   */
  @IsOptional()
  @IsNumber()
  nbYears?: number;
}
