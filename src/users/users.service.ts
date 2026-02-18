import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './interface/user';
import { mapPgError } from './utils/users.pg-error-map';
@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository
    ) { }

    async createUser(name: string, email?: string): Promise<User> {
        try {
            return await this.usersRepository.createUser(name, email)
        } catch (e: unknown) {
            mapPgError(e)
        }
    }

    async getUsers(): Promise<User[]> {
        return this.usersRepository.findAll()
    }

    async getUsersById(id: string): Promise<User> {
        try {
            return await this.usersRepository.findById(id)
        } catch (e: unknown) {
            if (e instanceof Error && e.message === 'user tidak terdaftar') {
                throw new NotFoundException('User tidak ditemukan')
            }
            mapPgError(e)
        }
    }

    /* 
     Object.fromEntries => mengubah aray dari key-value pair ke Object
     Object.entries => mengubah object menjadi array yang terdiri dari key-value pair
     Object.keys => mengubah keys object menjadi array key
     Object.values => mengubah values object menjadi array value
     */
    async updateUser(id: string, data: Partial<Omit<User, 'id' | 'name'>>): Promise<User> {
        const payload = Object.fromEntries(
            Object.entries(data).filter(([, value]) => value !== undefined)
        )
        if (Object.keys(payload).length === 0) throw new BadRequestException('data update kosong')
        try {
            return await this.usersRepository.update(id, payload)
        } catch (e: unknown) {
            if (e instanceof Error && e.message === 'user tidak ditemukan') {
                throw new NotFoundException('User tidak ditemukan')
            }
            mapPgError(e)
        }
    }

    async deleteUser(id: string): Promise<void> {
        try {
            const isDeleted = await this.usersRepository.softDelete(id)
            if (!isDeleted) {
                throw new NotFoundException('user tidak dapat ditemukan')
            }
        } catch (e) {
            throw new BadRequestException('id yang dimasukkan tidak terdaftar')
        }
    }
}
