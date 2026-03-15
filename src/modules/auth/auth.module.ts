import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { BcryptService } from 'src/modules/auth/service/bcrypt.service'
import { BCRYPT, SHA256 } from './auth.constants';
import { AuthController } from './presentation/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { Sha256Service } from './service/sha256.service';
import { RefreshTokenRepository } from './repository/refresh_token.repository';
import { AuthGuard } from '../../common/guards/auth.guard';
@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    JwtModule.register({
      global: true
    })
  ],
  providers: [
    AuthService,
    RefreshTokenRepository,
    AuthGuard,
    {
      provide: BCRYPT,
      useClass: BcryptService
    },
    {
      provide: SHA256,
      useClass: Sha256Service
    },
  ],
  controllers: [AuthController],
  exports: [AuthGuard]
})
export class AuthModule { }
