import { Body, Controller, Headers, Post, Ip, UseGuards } from '@nestjs/common';
import { AuthService } from '../../aplication/auth.service';
import { RegisterDto } from '../../aplication/dto/register.dto';
import { User } from 'src/modules/users/domain/entities/user';
import { LoginDto } from '../../aplication/dto/login.dto';
import { AuthGuard } from '../../../../common/guards/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('register')
    async register(@Body() payload: RegisterDto): Promise<Omit<User, 'password'>> {
        return await this.authService.register(payload)
    }

    //dto tidak bisa pake type utility, dia pake class
    @Post('login')
    async login(
        @Ip() ip: string,
        @Headers('user-agent') userAgent: string,
        @Body() payload: LoginDto
    ): Promise<
        {
            access: string,
            refresh: string,
            expiresIn: string
        }
    > {
        return await this.authService.login(ip, userAgent, payload)
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Body() payload: any): Promise<{ messege: string }> {
        const { refresh } = payload
        return await this.authService.logout(refresh)
    }

    @Post('refresh')
    async refresh(@Body() payload: any): Promise<{ access: string, expiresIn: string }> {
        const { refresh } = payload
        return await this.authService.refresh(refresh)
    }
}
