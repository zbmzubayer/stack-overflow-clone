'use server';

import Interaction from '@/db/models/interaction.model';
import Question from '@/db/models/question.model';
import { ViewQuestionParams } from '@/types/action';

export const viewQuestion = async (params: ViewQuestionParams) => {
  try {
    const { userId, questionId } = params;
    // Update view count for question
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });
    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: 'view',
        question: questionId,
      });
      if (!existingInteraction) {
        await Interaction.create({
          user: userId,
          action: 'view',
          question: questionId,
        });
      } else {
        await Interaction.findByIdAndUpdate(existingInteraction._id, { updatedAt: new Date() });
        console.log('User has already viewed');
        return;
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
