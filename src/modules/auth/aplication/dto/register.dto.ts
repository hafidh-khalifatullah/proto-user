import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'
export class RegisterDto {
    @IsNotEmpty({ message: "nama tidak boleh kosong" })
    @IsString({ message: "format nama salah" })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    readonly name: string

    @IsNotEmpty({ message: "email tidak boleh kosong" })
    @IsEmail()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    readonly email: string

    @IsNotEmpty({ message: "password harus dibuat" })
    @IsString()
    @MinLength(8, { message: "password minimal terdiri dari 8 karakter" })
    @MaxLength(20, { message: "password maksmial 20 karakter" })
    @Matches(
        /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S+$/,
        { message: 'password harus mengandung Huruf Besar, Huruf Kecil, Angka, dan Symbol' }
    )
    readonly password: string
}