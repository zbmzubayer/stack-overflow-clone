import { Schema, model, models } from 'mongoose';

export interface IUser {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  picture: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
  savedQuestions?: Schema.Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    bio: { type: String },
    picture: { type: String, required: true },
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number, default: 0 },
    savedQuestions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  },
  { timestamps: true },
);

const User = models.User || model<IUser>('User', userSchema);

export default User;
