'use server';

import Answer from '@/db/models/answer.model';
import Interaction from '@/db/models/interaction.model';
import Question from '@/db/models/question.model';
import User from '@/db/models/user.model';
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAllAnswersParams,
} from '@/types/action';
import { revalidatePath } from 'next/cache';

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    const { content, question, author, path } = params;
    const answer = await Answer.create({ content, question, author });
    // Add the answer to the question's answers array
    const answeredQuestion = await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });
    // Create an interaction
    await Interaction.create({
      user: author,
      action: 'answer',
      question,
      answer: answer._id,
      tags: answeredQuestion.tags,
    });
    // Increase author's 10 points for creating an answer
    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllAnswers = async (params: GetAllAnswersParams) => {
  try {
    const { questionId, sortBy, page = 1, pageSize = 10 } = params;
    const skip = (page - 1) * pageSize;

    let sortOptions = {};
    switch (sortBy) {
      case 'highestUpvotes':
        sortOptions = { upvotes: -1 };
        break;
      case 'lowestUpvotes':
        sortOptions = { upvotes: 1 };
        break;
      case 'recent':
        sortOptions = { createdAt: -1 };
        break;
      case 'old':
        sortOptions = { createdAt: 1 };
        break;
      default:
        break;
    }

    const answers = await Answer.find({ question: questionId })
      .populate('author', '_id clerkId name username picture')
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);
    const totalAnswers = await Answer.countDocuments({ question: questionId });
    const isNext = totalAnswers > skip + answers.length;
    return { answers, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const upvoteAnswer = async (params: AnswerVoteParams) => {
  try {
    const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;
    let updateQuery = {};
    if (hasUpvoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasDownvoted) {
      updateQuery = { $pull: { downvotes: userId }, $push: { upvotes: userId } };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true });
    if (!answer) throw new Error('Answer not found');
    // Increment user's reputation by +2/-2 for upvoting/revoking an answer
    await User.findByIdAndUpdate(userId, { $inc: { reputation: hasUpvoted ? -2 : 2 } });
    // Increment author's reputation by +10/-10 for receiving/revoking for an answer
    await User.findByIdAndUpdate(answer.author, { $inc: { reputation: hasUpvoted ? -10 : 10 } });
    revalidatePath(path);
    return answer;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const downvoteAnswer = async (params: AnswerVoteParams) => {
  try {
    const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;
    let updateQuery = {};
    if (hasDownvoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasUpvoted) {
      updateQuery = { $pull: { upvotes: userId }, $push: { downvotes: userId } };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true });
    if (!answer) throw new Error('Answer not found');

    // Same logic as upvoting
    await User.findByIdAndUpdate(userId, { $inc: { reputation: hasDownvoted ? -2 : 2 } });
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasDownvoted ? -10 : 10 },
    });
    revalidatePath(path);
    // Increment user's reputation by 10 for upvoting a answer
    return answer;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteAnswer = async (params: DeleteAnswerParams) => {
  try {
    const { answerId, path } = params;
    const answer = await Answer.findByIdAndDelete({ _id: answerId });
    if (!answer) throw new Error('Answer not found');
    await Question.updateMany({ _id: answer.question }, { $pull: { answers: answerId } });
    await Interaction.deleteMany({ answer: answerId });
    revalidatePath(path);
    return answer;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
