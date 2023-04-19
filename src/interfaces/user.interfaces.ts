import { JwtPayload } from 'jsonwebtoken';

// Model
export interface UserAttributes {
  id?: string;
  username: string;
  hashedPassword: string;
  recordStatus: boolean;
}

// Controllers
export interface UserPayload extends JwtPayload{
  id: string;
  usename: string;
  roles: string;
  iat: number;
  exp: number;
}
