import { Controller, Get, UseGuards, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { AdherentsService } from './adherents.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAdherentDto } from './dto/create-adherent.dto';
import { UpdateAdherentDto } from './dto/update-adherent.dto';
import { Adherent } from './schemas/adherents.schema';

@UseGuards(AuthGuard)
@Controller('adherents')
export class AdherentsController {
  constructor(private adherentsService: AdherentsService) {}

  /**
   * Creates a new adherent.
   * @param createAdherentDto - The DTO containing the adherent data to be created.
   * @returns The created adherent object.
   */
  @Post()
  createAdherent(@Body() createAdherentDto: CreateAdherentDto): Promise<Adherent> {
    return this.adherentsService.createAdherent(createAdherentDto);
  }

  /**
   * Updates an existing adherent by ID.
   * @param id - The ID of the adherent to update.
   * @param updateAdherentDto - The DTO containing updated adherent data.
   * @returns The updated adherent object.
   */
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateAdherentDto: UpdateAdherentDto
  ): Promise<Adherent> {
    return this.adherentsService.updateAdherent(id, updateAdherentDto);
  }

  /**
   * Retrieves all adherents.
   * @returns A list of all adherents.
   */
  @Get()
  getAllAdherents(): Promise<Adherent[]> {
    return this.adherentsService.getAllAdherents();
  }

  /**
   * Retrieves a specific adherent by ID.
   * @param id - The ID of the adherent to retrieve.
   * @returns The adherent object with the specified ID.
   */
  @Get(':id')
  getAdherentById(@Param('id') id: string): Promise<Adherent> {
    return this.adherentsService.getAdherentById(id);
  }

  /**
   * Deletes an adherent by ID.
   * @param id - The ID of the adherent to delete.
   * @returns A confirmation of the deletion.
   */
  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<Adherent> {
    return this.adherentsService.deleteById(id);
  }
}
