import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsersRepository } from './users.repository';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController]
})
export class UsersModule { }
