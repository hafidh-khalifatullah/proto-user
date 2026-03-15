import { Pool } from 'pg'
import { User } from '../../domain/entities/user'
import { Inject } from '@nestjs/common'
import { PG_CONNECTION } from 'src/database/database.constants'
export class UsersRepository {
    constructor(
        @Inject(PG_CONNECTION)
        private readonly pg: Pool
    ) { }

    async create(name: string, password: string, email: string): Promise<Omit<User, 'password'> | undefined> {
        const query: string = `
            INSERT INTO users (name, password, email)
            VALUES ($1, $2, $3) 
            RETURNING id, name, email, role, status
         `
        const result = await this.pg.query<User>(query, [name, password, email]);
        const user = result.rows[0];
        return user
    }

    async findAll(): Promise<Omit<User, "password">[]> {
        const query: string = `
            SELECT id, name, email, role, status FROM users
            WHERE deleted_at IS NULL
        `
        const result = await this.pg.query<User[]>(query);
        const users = result.rows
        return users
    }

    async findById(id: string): Promise<Omit<User, 'password'> | undefined> {
        const query: string = `
            SELECT id, name, email, role, status
            FROM users
            WHERE id = $1
        `
        const result = await this.pg.query<User>(query, [id])
        const user = result.rows[0]
        return user
    }

    async findByEmail(email: string): Promise<User | undefined> {
        const query: string = `
            SELECT id, name, email, password, role, status
            FROM users
            WHERE email = $1
        `
        const result = await this.pg.query(query, [email])
        const user = result.rows[0]
        return user
    }

    async update(id: string, update: Partial<Omit<User, 'id' | 'password'>>): Promise<Omit<User, 'password'> | undefined> {
        const entries = Object.entries(update)
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
        const user = result.rows[0]
        return user
    }

    async softDelete(id: string): Promise<boolean> {
        const query = `
            UPDATE users
            SET deleted_at = NOW()
            WHERE id = $1 AND deleted_at IS NULL
            RETURNING id, name, email
        `
        const result = await this.pg.query(query, [id])
        if (result.rowCount === 1) {
            return true
        } else {
            return false
        }
    }
}