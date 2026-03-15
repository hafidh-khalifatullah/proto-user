import { Injectable } from "@nestjs/common";
import { HashingService } from "../domain/entities/hashing-service";
import * as crypto from 'crypto'


@Injectable()
export class Sha256Service implements HashingService {
    async hash(data: string): Promise<string> {
        return crypto.createHash('sha256')
            .update(data)
            .digest("hex")
    }

    async compare(data: string, hash: string): Promise<boolean> {
        const hashedData = await this.hash(data)
        return hashedData === hash
    }
}