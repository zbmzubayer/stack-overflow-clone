'use server';

import { FilterQuery } from 'mongoose';
import { revalidatePath } from 'next/cache';
import Answer from '@/db/models/answer.model';
import Interaction from '@/db/models/interaction.model';
import Question from '@/db/models/question.model';
import Tag from '@/db/models/tag.model';
import User from '@/db/models/user.model';
import {
  DeleteQuestionParams,
  EditQuestionParams,
  GetAllQuestionsParams,
  QuestionVoteParams,
} from '@/types/action';

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
    // Create an interaction for the user's ask question action
    await Interaction.create({
      user: payload.author,
      action: 'ask_question',
      question: question._id,
      tags: tagDocuments,
    });
    // Increment reputation by 5 points
    await User.findByIdAndUpdate(payload.author, { $inc: { reputation: 5 } });
    revalidatePath('/');
  } catch (err) {
    console.log('Failed to create question', err);
    throw err;
  }
};

export const getAllQuestions = async (params: GetAllQuestionsParams) => {
  try {
    const { searchQuery, filter, page = 1, pageSize = 20 } = params;
    const query: FilterQuery<typeof Question> = {};
    const skip = (page - 1) * pageSize;

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, 'i') } },
        { content: { $regex: new RegExp(searchQuery, 'i') } },
      ];
    }
    let sortOptions = {};

    switch (filter) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'frequent':
        sortOptions = { views: -1 };
        break;
      case 'unanswered':
        query.answers = { $size: 0 };
        break;
      default:
        break;
    }

    const questions = await Question.find(query)
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .skip(skip)
      .limit(pageSize)
      .sort(sortOptions);

    const totalQuestions = await Question.countDocuments(query);
    const isNext = totalQuestions > skip + questions.length;
    return { questions, isNext };
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
    // Increment user's reputation by +1/-1 for upvoting/revoking a question
    await User.findByIdAndUpdate(userId, { $inc: { reputation: hasUpvoted ? -1 : 1 } });
    // Increments author's reputation by +10/-10 for receiving/removing an upvote for the question
    await User.findByIdAndUpdate(question.author, { $inc: { reputation: hasUpvoted ? -10 : 10 } });

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
    // Same logic as upvoting
    await User.findByIdAndUpdate(userId, { $inc: { reputation: hasDownvoted ? -1 : 1 } });
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasDownvoted ? -10 : 10 },
    });
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

export const getTopQuestions = async () => {
  try {
    const topQuestions = await Question.find({}).sort({ views: -1, upvotes: -1 }).limit(5);
    return topQuestions;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
