import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AdherentsModule } from './adherents/adherents.module';
import { UsersModule } from './users/users.module';
import configuration from './config/configuration';

@Module({
  imports: [
    AuthModule, 
    AdherentsModule, 
    UsersModule, 
    ConfigModule.forRoot({
      load: [configuration], 
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongooseConfig = configService.get('mongoose');
        return {
          uri: `mongodb://${mongooseConfig.user}:${mongooseConfig.password}@localhost:${mongooseConfig.port}/${mongooseConfig.dbName}`,
        };
      },
    }),
  ],
})
export class AppModule {}
