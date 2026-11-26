import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }

    const userId = payload.userId || payload.id;

    return jwt.sign(
        {
            userId,
            email: payload.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES || '1d',
        }
    );
};