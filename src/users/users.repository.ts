import { Pool } from 'pg'
import { User } from './interface/user'
import { Inject } from '@nestjs/common'
import { PG_CONNECTION } from 'src/database/database.constants'
export class UsersRepository {
    constructor(
        @Inject(PG_CONNECTION)
        private readonly pg: Pool
    ) { }

    async createUser(name: string, email?: string): Promise<User> {
        const query: string = `
            INSERT INTO users (name, email)
            VALUES ($1, $2) 
            RETURNING id, name, email, role, status
         `
        const result = await this.pg.query<User>(query, [name, email ?? null]);
        return result.rows[0];
    }

    async findAll(): Promise<User[]> {
        const query: string = `
            SELECT id, name, email, role, status FROM users
            WHERE deleted_at IS NULL
        `
        const result = await this.pg.query<User[]>(query);
        return result.rows
    }

    async findById(id: string): Promise<User> {
        const query: string = `
            SELECT id, name, email, role, status
            FROM users
            WHERE id = $1
        `
        const result = await this.pg.query<User>(query, [id])
        if (result.rows.length === 0) {
            throw new Error('user tidak terdaftar')
        }
        return result.rows[0]
    }

    async update(id: string, update: Partial<Omit<User, 'id' | 'name'>>): Promise<User> {
        const entries = Object.entries(update)
        if (entries.length === 0) {
            throw new Error('payload update kosong')
        }
        const setClause = entries
            .map(([key], index) => `${key} = $${index + 1}`)
            .join(', ')
        const values = entries.map(([, value]) => value)
        const query = `
            UPDATE users
            SET ${setClause}
            WHERE id = $${values.length + 1}
            RETURNING id, name, email, role, status
        `
        const result = await this.pg.query(query, [
            ...values,
            id
        ])
        if (result.rows.length === 0) {
            throw new Error('user tidak ditemukan')
        }
        return result.rows[0]
    }

    async softDelete(id: string): Promise<boolean> {
        const query = `
            UPDATE users
            SET deleted_at = NOW()
            WHERE id = $1 AND deleted_at IS NULL
            RETURNING id
        `
        const result = await this.pg.query(query, [id])
        return result.rowCount === 1
    }
}