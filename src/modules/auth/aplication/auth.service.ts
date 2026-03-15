import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BCRYPT, SHA256 } from '../auth.constants';
import { UsersRepository } from 'src/modules/users/infrasturcture/repositories/users.repository';
import { User } from 'src/modules/users/domain/entities/user';
import { BcryptService } from './bcrypt.service';
import { Sha256Service } from './sha256.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenRepository } from '../repository/refresh_token.repository';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { DateHelper } from '../helper/date';
@Injectable()
export class AuthService {
    constructor(
        @Inject(BCRYPT)
        private readonly bcryptService: BcryptService,
        @Inject(SHA256)
        private readonly sha256Service: Sha256Service,
        private readonly jwtService: JwtService,
        private readonly usersRepository: UsersRepository,
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly config: ConfigService,
    ) { }

    async register(payload: Pick<User, 'name' | 'email' | 'password'>): Promise<Omit<User, 'password'>> {
        const { name, email, password } = payload
        const hashedPassword = await this.bcryptService.hash(password)
        return await this.usersRepository.create(name, hashedPassword, email)
    }

    async login(
        ip: string,
        userAgent: string,
        payload: Pick<User, 'email' | 'password'>
    ): Promise<
        {
            access: string,
            refresh: string,
            expiresIn: string
        }
    > {
        const user = await this.usersRepository.findByEmail(payload.email)
        if (!user) {
            throw new NotFoundException('email atau password salah')
        }
        const ok = await this.bcryptService.compare(
            payload.password,
            user.password
        )
        if (!ok) {
            throw new NotFoundException('email atau password salah')
        }
        const access = await this.jwtService.signAsync(
            { sub: user.id, role: user.role },
            {
                secret: this.config.get<string>('ACCESS'),
                expiresIn: '15m',
            },
        )
        const jwtid = randomUUID()
        const refresh = await this.jwtService.signAsync(
            { sub: user.id, role: user.role, jti: jwtid },
            {
                secret: this.config.get<string>('REFRESH'),
                expiresIn: '7d',
            },
        )
        const hash = await this.sha256Service.hash(refresh)
        await this.refreshTokenRepository.create(
            jwtid,
            user.id,
            hash,
            DateHelper.addDays(new Date(), 7),
            ip,
            userAgent
        )
        return {
            access,
            refresh,
            expiresIn: '900'
        }
    }
    async logout(refresh: string): Promise<{ messege: string }> {
        const payload = await this.jwtService.verifyAsync(refresh, {
            secret: this.config.get<string>('REFRESH')
        })
        console.log(payload)
        await this.refreshTokenRepository.revokeHash(payload.jti)
        return {
            messege: 'Logout sukses: agar client menghapus token'
        }
    }

    async refresh(refresh: string): Promise<{ access: string, expiresIn: string }> {
        const payload = await this.jwtService.verifyAsync(refresh, {
            secret: this.config.get<string>('REFRESH')
        })
        console.log(payload)
        try {
            const token = await this.refreshTokenRepository.findHash(payload.jti, payload.sub)
            if (!token) throw new NotFoundException('token tidak ditemukan')
            if (
                token.expired_at > new Date() &&
                token.revoked_at === null
            ) {
                const access = await this.jwtService.signAsync(
                    { sub: payload.sub, role: payload.role, jti: payload.jti },
                    {
                        secret: this.config.get<string>('ACCESS'),
                        expiresIn: '15m'
                    }
                )
                return {
                    access,
                    expiresIn: '900'
                }
            } else {
                throw new UnauthorizedException()
            }
        } catch (e) {
            throw e
        }
    }
}
