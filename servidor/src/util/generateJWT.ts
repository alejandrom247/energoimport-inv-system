import jwt, { JwtPayload } from "jsonwebtoken"
import ms from "ms"

interface SignOptions {
    expiresIn?: ms.StringValue | number | undefined;
}
const DEFAULT_SIGN_OPTION: SignOptions = {
    expiresIn: '15m',
};
export function generateAccessToken(
    payload: JwtPayload,
    options: SignOptions = DEFAULT_SIGN_OPTION
) {
    const secret = process.env.SECRET_KEY;

    const token = jwt.sign(payload, secret!, options);
    return token;
}