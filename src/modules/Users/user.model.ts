import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../app/config';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    phone: { type: String },
    role: {
      type: String,
      enum: ['admin', 'customer'],
      default: 'customer',
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

// 🔐 Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  const user = this as IUser;
  if (!user.isModified('password')) return next(); // only hash if changed
  user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds || 10));
  next();
});

// 🧠 Static Methods
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await this.findOne({ _id: id }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number
): boolean {
  const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

// ✅ Final model export
export const User = mongoose.model<IUser, UserModel>('User', userSchema);
