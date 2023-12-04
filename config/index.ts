const envConfig = {
  MONGODB_URI: process.env.MONGODB_URI as string,
  TINY_API_KEY: process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY,
  CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};

export default envConfig;
