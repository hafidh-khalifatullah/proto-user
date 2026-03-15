import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersController } from './presentation/controllers/users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsersRepository } from './infrasturcture/repositories/users.repository';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersRepository]
})
export class UsersModule { }
