import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';  

@Module({
  imports: [
    UsersModule, 
    JwtModule.registerAsync({
      global: true, 
      imports: [ConfigModule], 
      inject: [ConfigService], 
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),  
        signOptions: { expiresIn: '1h' }
      }),
    }),
  ], 
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
