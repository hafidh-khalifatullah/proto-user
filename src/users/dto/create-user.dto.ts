import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Transform } from 'class-transformer'
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    readonly name: string

    @IsOptional()
    @IsString()
    @IsEmail()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    readonly email: string
}