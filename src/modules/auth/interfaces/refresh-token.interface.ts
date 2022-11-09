import { Document } from 'mongoose';
import { UserDocument } from '../../users/schemas/user.schema';

export interface RefreshToken extends Document {
  userId: UserDocument;
  refreshToken: string;
  ip: string;
  browser: string;
  country: string;
}
