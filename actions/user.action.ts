'use server';

import { FilterQuery } from 'mongoose';
import { revalidatePath } from 'next/cache';
import connectToDb from '@/db';
import User, { IUser } from '@/db/models/user.model';
import Question from '@/db/models/question.model';
import Answer from '@/db/models/answer.model';
import Tag from '@/db/models/tag.model';
import {
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
} from '@/types/action';

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

export const getAllUsers = async (params: GetAllUsersParams) => {
  try {
    const { page = 1, pageSize = 20, filter, searchQuery } = params;
    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, 'i') } },
        { username: { $regex: new RegExp(searchQuery, 'i') } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    return users;
  } catch (err) {
    console.log('Failed to get all users', err);
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

export const updateUser = async (clerkId: string, payload: any) => {
  try {
    const user = await User.findOneAndUpdate({ clerkId }, payload, { new: true });
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
    const userQuestionIds = await Question.find({ author: user._id }).distinct('_id');
    await Question.deleteMany({ author: user._id });
    // Todo: delete user's answers

    return user;
  } catch (err) {
    console.log('Failed to delete user', err);
    throw err;
  }
};

export const toggleSaveQuestion = async (params: ToggleSaveQuestionParams) => {
  try {
    const { questionId, userId, path } = params;
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    const isQuestionSaved = user.savedQuestions.includes(questionId);
    if (isQuestionSaved) {
      // remove question from savedQuestions
      await user.updateOne({ $pull: { savedQuestions: questionId } });
    } else {
      // add question to savedQuestions
      await user.updateOne({ $push: { savedQuestions: questionId } });
    }
    revalidatePath(path);
  } catch (err) {
    console.log('Failed to save question', err);
    throw err;
  }
};

export const getSavedQuestions = async (params: GetSavedQuestionsParams) => {
  try {
    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;
    const query: FilterQuery<typeof Question> = searchQuery
      ? { $regex: new RegExp(searchQuery, 'i') }
      : {};
    const user = await User.findOne({ clerkId }).populate({
      path: 'savedQuestions',
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name username picture' },
      ],
    });
    if (!user) throw new Error('User not found');
    const savedQuestions = user.savedQuestions;
    return savedQuestions;
  } catch (err) {
    console.log('Failed to get saved questions', err);
    throw err;
  }
};

export const getUserInfo = async (username: string) => {
  try {
    const user = await User.findOne({ username });
    if (!user) throw new Error('User not found');
    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });
    return { user, totalQuestions, totalAnswers };
  } catch (err) {
    console.log('Failed to get user info', err);
    throw err;
  }
};

export const getUserQuestions = async (params: GetUserStatsParams) => {
  try {
    const { userId, page = 1, pageSize = 10 } = params;
    const totalQuestions = await Question.countDocuments({ author: userId });
    const userQuestions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .populate('tags', '_id name')
      .populate('author', '_id clerkId name username picture');
    return { totalQuestions, userQuestions };
  } catch (err) {
    console.log('Failed to get user questions', err);
    throw err;
  }
};

export const getUserAnswers = async (params: GetUserStatsParams) => {
  try {
    const { userId, page = 1, pageSize = 10 } = params;
    const totalAnswers = await Answer.countDocuments({ author: userId });
    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .populate('question', '_id title')
      .populate('author', '_id clerkId name username picture');
    return { totalAnswers, userAnswers };
  } catch (err) {
    console.log('Failed to get user answers', err);
    throw err;
  }
};
