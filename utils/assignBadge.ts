export const BadgeCriteria = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};

type TBadgeCriteria = keyof typeof BadgeCriteria;

export interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

interface BadgeParams {
  totalQuestions: number;
  totalAnswers: number;
  questionUpvotes: number;
  answerUpvotes: number;
  totalViews: number;
}

export default function assignBadge({
  totalQuestions,
  totalAnswers,
  questionUpvotes,
  answerUpvotes,
  totalViews,
}: BadgeParams) {
  const badgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };
  const criteria = [
    { type: 'QUESTION_COUNT' as TBadgeCriteria, count: totalQuestions },
    { type: 'ANSWER_COUNT' as TBadgeCriteria, count: totalAnswers },
    { type: 'QUESTION_UPVOTES' as TBadgeCriteria, count: questionUpvotes },
    { type: 'ANSWER_UPVOTES' as TBadgeCriteria, count: answerUpvotes },
    { type: 'TOTAL_VIEWS' as TBadgeCriteria, count: totalViews },
  ];

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgeLevels: any = BadgeCriteria[type];
    Object.keys(badgeLevels).forEach((level) => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1;
      }
    });
  });
  return badgeCounts;
}
