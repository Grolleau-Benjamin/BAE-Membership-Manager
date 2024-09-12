import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Adherent, AdherentDocument } from './schemas/adherents.schema';
import { CreateAdherentDto } from './dto/create-adherent.dto';
import { UpdateAdherentDto } from './dto/update-adherent.dto';

@Injectable()
export class AdherentsService {
  constructor(
    @InjectModel(Adherent.name) private adherentModel: Model<AdherentDocument>,
  ) {}

  /**
   * Creates a new adherent in the database.
   * 
   * @param createAdherentDto - The DTO containing the adherent data.
   * @returns The created adherent.
   * @throws HttpException if the required fields are missing.
   */
  async createAdherent(createAdherentDto: CreateAdherentDto): Promise<Adherent> {
    if (!createAdherentDto.name) {
      throw new HttpException("Name field is required.", HttpStatus.BAD_REQUEST);
    }
    if (!createAdherentDto.firstname) {
      throw new HttpException("Firstname field is required.", HttpStatus.BAD_REQUEST);
    }

    const newAdherent = new this.adherentModel({
      name: createAdherentDto.name,
      firstname: createAdherentDto.firstname,
      dateAdherence: createAdherentDto.dateAdherence ? new Date(createAdherentDto.dateAdherence) : new Date(),
      nbYears: createAdherentDto.nbYears ?? 1,
    });

    return newAdherent.save();
  }

  /**
   * Updates an existing adherent by ID.
   * 
   * @param adherentId - The ID of the adherent to update.
   * @param updateAdherentDto - The DTO containing the updated adherent data.
   * @returns The updated adherent.
   * @throws NotFoundException if the adherent is not found.
   */
  async updateAdherent(adherentId: string, updateAdherentDto: UpdateAdherentDto): Promise<Adherent> {
    const existingAdherent = await this.adherentModel.findByIdAndUpdate(
      adherentId, 
      updateAdherentDto, 
      { new: true }
    );

    if (!existingAdherent) {
      throw new NotFoundException(`Adherent #${adherentId} not found.`);
    }

    return existingAdherent;
  }

  /**
   * Retrieves all adherents from the database.
   * 
   * @returns A list of all adherents.
   */
  async getAllAdherents(): Promise<Adherent[]> {
    return this.adherentModel.find().exec();
  }

  /**
   * Retrieves a specific adherent by ID.
   * 
   * @param id - The ID of the adherent to retrieve.
   * @returns The adherent with the given ID.
   * @throws HttpException if the adherent is not found.
   */
  async getAdherentById(id: string): Promise<Adherent> {
    const adherent = await this.adherentModel.findById(id).exec();
    if (!adherent) {
      throw new HttpException('Adherent not found', HttpStatus.NOT_FOUND);
    }
    return adherent;
  }

  /**
   * Deletes an adherent by ID.
   * 
   * @param id - The ID of the adherent to delete.
   * @returns The deleted adherent.
   * @throws HttpException if the adherent is not found.
   */
  async deleteById(id: string): Promise<Adherent> {
    const deleteAdherent = await this.adherentModel.findByIdAndDelete(id).exec();

    if (!deleteAdherent) {
      throw new HttpException(`Adherent #${id} not found`, HttpStatus.NOT_FOUND);
    }

    return deleteAdherent;
  }
}
