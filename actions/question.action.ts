'use server';

import Answer from '@/db/models/answer.model';
import Interaction from '@/db/models/interaction.model';
import Question, { IQuestion } from '@/db/models/question.model';
import Tag from '@/db/models/tag.model';
import User from '@/db/models/user.model';
import { DeleteQuestionParams, EditQuestionParams, QuestionVoteParams } from '@/types/action';
import { revalidatePath } from 'next/cache';

export const createQuestion = async (payload: any) => {
  const { tags, ...rest } = payload;
  try {
    const question = await Question.create(rest);
    let tagDocuments = [];
    for (const tagName of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tagName}$`, 'i') } },
        { $setOnInsert: { name: tagName }, $push: { questions: question._id } },
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

export const getQuestionById = async (id: string) => {
  try {
    const question = await Question.findById(id)
      .populate({
        path: 'tags',
        model: Tag,
        select: '_id name',
      })
      .populate({
        path: 'author',
        model: User,
        select: '_id clerkId name picture',
      });
    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const upvoteQuestion = async (params: QuestionVoteParams) => {
  try {
    const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;
    let updateQuery = {};
    if (hasUpvoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasDownvoted) {
      updateQuery = { $pull: { downvotes: userId }, $push: { upvotes: userId } };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true });
    if (!question) throw new Error('Question not found');
    revalidatePath(path);
    // Increment user's reputation by 10 for upvoting a question
    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const downvoteQuestion = async (params: QuestionVoteParams) => {
  try {
    const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;
    let updateQuery = {};
    if (hasDownvoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasUpvoted) {
      updateQuery = { $pull: { upvotes: userId }, $push: { downvotes: userId } };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true });
    if (!question) throw new Error('Question not found');
    revalidatePath(path);
    // Increment user's reputation by 10 for upvoting a question
    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateQuestion = async (params: EditQuestionParams) => {
  try {
    const { questionId, title, content, path } = params;
    const question = await Question.findByIdAndUpdate(
      { _id: questionId },
      { title, content },
      { new: true },
    );
    if (!question) throw new Error('Question not found');
    revalidatePath(path);
    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteQuestion = async (params: DeleteQuestionParams) => {
  try {
    const { questionId, path } = params;
    const question = await Question.findByIdAndDelete({ _id: questionId });
    if (!question) throw new Error('Question not found');
    await Answer.deleteMany({ question: questionId });
    await Tag.updateMany({ questions: questionId }, { $pull: { questions: questionId } });
    await Interaction.deleteMany({ question: questionId });
    revalidatePath(path);
    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
