import * as bcrypt from 'bcrypt';

export const generateHash = (password: string) => bcrypt.hash(password, 10);
export const verifyHash = (password: string, hash: string) => bcrypt.compare(password, hash);