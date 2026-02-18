import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { Role, Status } from '../interface/user'
export class UpdateUserDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    readonly email?: string

    @IsOptional()
    @IsEnum(Role)
    readonly role?: Role

    @IsOptional()
    @IsEnum(Status)
    readonly status?: Status
}