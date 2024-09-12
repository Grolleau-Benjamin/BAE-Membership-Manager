import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdherentDocument = Adherent & Document;

/**
 * Schema definition for the Adherent model.
 */
@Schema()
export class Adherent {

  /**
   * The adherent's name.
   * This field is required.
   */
  @Prop({ required: true })
  name: string;

  /**
   * The adherent's first name.
   * This field is required.
   */
  @Prop({ required: true })
  firstname: string;

  /**
   * The date of adherence.
   * This field is required and defaults to the current date if not provided.
   */
  @Prop({ required: true, default: Date.now })
  dateAdherence: Date;

  /**
   * The number of years of adherence.
   * This field is required and defaults to 1 if not provided.
   */
  @Prop({ required: true, default: 1 })
  nbYears: number;
}

/**
 * Mongoose schema for the Adherent class.
 * This is used to define the structure of the Adherent document in MongoDB.
 */
export const AdherentSchema = SchemaFactory.createForClass(Adherent);
