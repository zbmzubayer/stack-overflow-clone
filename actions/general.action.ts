'use server';

import Answer from '@/db/models/answer.model';
import Question from '@/db/models/question.model';
import Tag from '@/db/models/tag.model';
import User from '@/db/models/user.model';
import { SearchParams } from '@/types/action';

const searchableTypes = ['question', 'answer', 'user', 'tag'];

export const globalSearch = async (params: SearchParams) => {
  try {
    const { query, type } = params;
    const regexQuery = { $regex: query, $options: 'i' };
    let results = [];
    const modelsAndTypes = [
      { model: Question, type: 'question', searchField: 'title' },
      { model: Answer, type: 'answer', searchField: 'content' },
      { model: User, type: 'user', searchField: 'name' },
      { model: Tag, type: 'tag', searchField: 'name' },
    ];
    const typeLower = type?.toLowerCase();
    if (!typeLower || !searchableTypes.includes(typeLower)) {
      // Search in all types
      for (const { model, type, searchField } of modelsAndTypes) {
        const queryResults = await model.find({ [searchField]: regexQuery }).limit(2);
        results.push(
          ...queryResults.map((item) => ({
            title: type === 'answer' ? `Answer containing ${query}` : item[searchField],
            type,
            id: type === 'user' ? item.username : type === 'answer' ? item.question : item._id,
          })),
        );
      }
    } else {
      // Search in specific type
      const modelInfo = await modelsAndTypes.find((item) => item.type === typeLower);
      if (!modelInfo) {
        throw new Error('Invalid search type');
      }
      const queryResults = await modelInfo.model
        .find({ [modelInfo.searchField]: regexQuery })
        .limit(8);
      results = queryResults.map((item) => ({
        title: type === 'answer' ? `Answer containing ${query}` : item[modelInfo.searchField],
        type,
        id: type === 'user' ? item.username : type === 'answer' ? item.question : item._id,
      }));
    }
    return JSON.stringify(results);
  } catch (err) {
    console.log('Error fetching global search', err);
    throw err;
  }
};
