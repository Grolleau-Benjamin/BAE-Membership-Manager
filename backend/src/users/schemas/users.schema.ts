import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, UpdateQuery } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {
  /**
   * The username of the user.
   * This field is required.
   */
  @Prop({ required: true })
  username: string;

  /**
   * The password of the user.
   * This field is required.
   * The password is hashed before saving to the database.
   */
  @Prop({ required: true })
  password: string;

  /**
   * The role of the user, either 'admin' or 'user'.
   * This field is required, and defaults to 'user'.
   */
  @Prop({ required: true, default: 'user' })
  role: 'admin' | 'user';
}

export const UserSchema = SchemaFactory.createForClass(User);

/**
 * Pre-save hook to hash the password before saving the user document.
 */
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Pre-update hook to hash the password before updating the user document.
 */
UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();

  if (update && typeof update === 'object' && 'password' in update) {
    const updateQuery = update as UpdateQuery<UserDocument>;

    if (updateQuery.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        updateQuery.password = await bcrypt.hash(updateQuery.password, salt);
        this.setUpdate(updateQuery);
      } catch (err) {
        return next(err);
      }
    }
  }

  next();
});
