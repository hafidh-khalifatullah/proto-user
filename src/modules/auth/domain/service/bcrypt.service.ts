import { Injectable } from "@nestjs/common";
import { HashingService } from "../domain/entities/hashing-service";
import * as bcrypt from 'bcrypt-ts'

@Injectable()
export class BcryptService implements HashingService {
    async hash(data: string): Promise<string> {
        try {
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(data, salt)
            return hash
        } catch (e) {
            throw new Error('SOMETHING_WENT_WRONG_ON_HASING_PASSWORD')
        }
    }

    async compare(data: string, hash: string): Promise<boolean> {
        try {
            return await bcrypt.compare(data, hash)
        } catch (e) {
            throw new Error('SOMETHING_WENT_WRONG_ON_COMPARE_PASSWORD')
        }
    }
}
