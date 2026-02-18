import { Controller, Get, Param, ParseUUIDPipe, Post, Body, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './interface/user';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Get()
    async readUsers(): Promise<User[]> {
        return await this.usersService.getUsers()
    }

    @Get(':id')
    async readUserById(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
        return await this.usersService.getUsersById(id)
    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        let { name, email } = createUserDto
        return await this.usersService.createUser(name, email);
    }

    @Patch(':id')
    async updateUser(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<User> {
        return await this.usersService.updateUser(id, updateUserDto)
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        await this.usersService.deleteUser(id)
        return {
            messege: 'user berhasil dihapus'
        }
    }
}