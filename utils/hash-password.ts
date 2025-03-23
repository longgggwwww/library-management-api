import * as bcrypt from 'bcrypt';

// Hash password
export async function hashPwd(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}
