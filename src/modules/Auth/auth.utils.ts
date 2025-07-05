
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";


export const createToken = (
  payload: string | object | Buffer,
  secret: Secret,
  expiresIn: jwt.SignOptions['expiresIn']
): string => {
  if (!secret) {
    throw new Error("JWT secret not provided");
  }

  // expiresIn should be part of options with correct typing
  const options: SignOptions = { expiresIn };

  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string, secret: Secret): JwtPayload => {
  if (!secret) {
    throw new Error("JWT secret not provided");
  }
  return jwt.verify(token, secret) as JwtPayload;
};