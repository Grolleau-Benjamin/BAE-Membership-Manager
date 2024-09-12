import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdherentsController } from './adherents.controller';
import { AdherentsService } from './adherents.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Adherent, AdherentSchema } from './schemas/adherents.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Adherent.name, schema: AdherentSchema }]), 
  ],
  controllers: [AdherentsController],
  providers: [AdherentsService, AuthGuard],
})
export class AdherentsModule {}
