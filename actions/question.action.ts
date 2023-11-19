'use server';

import Question, { IQuestion } from '@/db/models/question.model';
import Tag from '@/db/models/tag.model';
import User from '@/db/models/user.model';
import { revalidatePath } from 'next/cache';

export const createQuestion = async (payload: any) => {
  const { tags, ...rest } = payload;
  try {
    const question = await Question.create(rest);
    let tagDocuments = [];
    for (const tagName of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tagName}$`, 'i') } },
        { $setOnInsert: { name: tagName }, $push: { question: question._id } },
        { upsert: true, new: true },
      );
      tagDocuments.push(existingTag._id);
    }
    await Question.findByIdAndUpdate(question._id, { $push: { tags: { $each: tagDocuments } } });
    revalidatePath('/');
  } catch (err) {
    console.log('Failed to create question', err);
    throw err;
  }
};

export const getAllQuestions = async ({}) => {
  try {
    const questions = await Question.find({})
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .sort({ createdAt: -1 });
    return questions;
  } catch (err) {
    console.log('Failed to get all questions', err);
    throw err;
  }
};
