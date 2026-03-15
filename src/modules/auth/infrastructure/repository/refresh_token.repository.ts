import { Inject } from "@nestjs/common";
import { Pool } from "pg"
import { PG_CONNECTION } from "src/database/database.constants";
import { RefreshToken } from "../domain/entities/refresh-token";

export class RefreshTokenRepository {
    constructor(
        @Inject(PG_CONNECTION)
        private readonly pg: Pool
    ) { }

    async create(
        id: string,
        userId: string,
        hash: string,
        expired: Date,
        ip: string,
        userAgent: string
    ): Promise<void> {
        const query = `
            INSERT INTO refresh_token 
            (id, 
            user_id, 
            token_hash, 
            expired_at, 
            ip_address, 
            user_agent)
            VALUES ($1, $2, $3, $4, $5, $6)
        `
        try {
            await this.pg.query(query,
                [
                    id,
                    userId,
                    hash,
                    expired,
                    ip,
                    userAgent
                ]
            )
        } catch (e) {
            throw e
        }
    }

    async findHash(jti: string, userId: string): Promise<RefreshToken> {
        const query = `
            SELECT expired_at, revoked_at
            FROM refresh_token
            WHERE id = $1 AND user_id = $2 
        `
        try {
            const result = await this.pg.query(query, [jti, userId])
            if (result.rows.length === 0) throw new Error('TOKEN_NOT_FOUND')
            return result.rows[0]
        } catch (e) {
            throw e
        }
    }

    async revokeHash(jti: string): Promise<void> {
        const query = `
            UPDATE refresh_token
            SET revoked_at = NOW()
            WHERE id = $1 AND revoked_at IS NULL
        `
        try {
            await this.pg.query(query, [jti])
        } catch (e) {
            throw e
        }
    }
}