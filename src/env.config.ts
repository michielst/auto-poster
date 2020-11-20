import * as dotenv from 'dotenv';
dotenv.config();

export default {
    database: process.env.DATABASE_NAME,
    subreddit: process.env.SUBREDDIT,
    instagramUsername: process.env.INSTAGRAM_USERNAME,
    instagramPassword: process.env.INSTAGRAM_PASSWORD,
    tags: process.env.TAGS,
    timeoutSeconds: Number(process.env.TIMEOUT_SECONDS),
    postOnStory: process.env.POST_ON_STORY
};
