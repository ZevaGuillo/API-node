import { compareSync, genSaltSync, hashSync } from 'bcryptjs'

export const bcryptAdapter = {
    hash(plainText: string): string {
        const salt = genSaltSync(10);
        return hashSync(plainText, salt);
    },

    compare(plainText: string, hash: string): boolean {
        return compareSync(plainText, hash);
    }
}