export interface RefreshToken {
    token_hash: string
    expired_at: Date
    revoked_at: Date
}