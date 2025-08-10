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


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();


  const saltRounds = Number(config.bcrypt_salt_rounds) || 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.statics.isUserExistsByCustomId = function (id: string) {
  return this.findById(id).select('+password').lean();
};


userSchema.statics.isPasswordMatched = function (plainText: string, hashed: string) {
  return bcrypt.compare(plainText, hashed);
};


userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedAt: Date,
  jwtIssuedTimestamp: number
) {
  if (!passwordChangedAt) return false;
  return passwordChangedAt.getTime() / 1000 > jwtIssuedTimestamp;
};



// ✅ Final model export
export const User = mongoose.model<IUser, UserModel>('User', userSchema);
