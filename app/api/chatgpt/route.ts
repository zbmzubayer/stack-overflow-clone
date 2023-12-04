import envConfig from '@/config';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  const { question } = await request.json();
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${envConfig.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable assistant that provides quality information.',
          },
          {
            role: 'user',
            content: `Tell me ${question}`,
          },
        ],
      }),
    });
    const data = await res.json();
    const reply = data.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
};
