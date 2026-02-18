import { Pool } from 'pg'
import { Module } from '@nestjs/common';
import { PG_CONNECTION } from './database.constants';
import { ConfigService } from '@nestjs/config';

const pgProvider = {
    provide: PG_CONNECTION,
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
        const pg = new Pool({
            host: config.get<string>('PG_HOST'),
            port: config.get<number>('PG_PORT'),
            user: config.get<string>('PG_USER'),
            password: config.get<string>('PG_PASSWORD'),
            database: config.get<string>('PG_DB'),
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
            maxLifetimeSeconds: 60,
            max: 10
        })
        return pg
    }
}

@Module({
    providers: [pgProvider, ConfigService],
    exports: [pgProvider]
})
export class DatabaseModule { }
