'use server';

import { revalidatePath } from 'next/cache';
import connectToDb from '@/db';
import User, { IUser } from '@/db/models/user.model';

export const createUser = async (payload: IUser) => {
  connectToDb();
  try {
    const user = await User.create(payload);
    return user;
  } catch (err) {
    console.log('Failed to create user', err);
    throw err;
  }
};

export const getUserById = async (clerkId: string) => {
  try {
    const user = await User.findOne({ clerkId: clerkId });
    return user;
  } catch (err) {
    console.log('Failed to get user by id', err);
    throw err;
  }
};

export const updateUser = async (clerkId: string, payload: IUser) => {
  try {
    const user = await User.findOneAndUpdate({ clerkId: clerkId }, payload, { new: true });
    revalidatePath(`/profile/${user.username}`);
    return user;
  } catch (err) {
    console.log('Failed to update user', err);
    throw err;
  }
};

export const deleteUser = async (clerkId: string) => {
  try {
    const user = await User.findOneAndDelete({ clerkId });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (err) {
    console.log('Failed to delete user', err);
    throw err;
  }
};
