import { BadRequestException, ConflictException, InternalServerErrorException } from "@nestjs/common"

type PgErrorLike = {
    code: string,
    table?: string,
    detail?: string,
}

/* #is "Kalau fungsi tersebut menghasilkan nilai true, maka TypeScript akan menganggap parameter tersebut sebagai tipe data yang kita tentukan."
 */
function isPgError(e: unknown): e is PgErrorLike {
    return (
        typeof e === 'object' &&
        e !== null &&
        typeof (e as any).code === 'string'
    )
}

export function mapPgError(e: unknown): never {
    if (isPgError(e)) {
        switch (e.code) {
            case '23505':
                throw new ConflictException('data email sudah ada')
            case '23502':
                throw new BadRequestException('field name tidak boleh kosong')
            case '42703':
                throw new BadRequestException('field tidak tersedia')
        }
    }

    throw new InternalServerErrorException()
}
