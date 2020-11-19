import * as dotenv from 'dotenv';
dotenv.config();

export default {
    subreddit: process.env.SUBREDDIT,
    instagramUsername: process.env.INSTAGRAM_USERNAME,
    instagramPassword: process.env.INSTAGRAM_PASSWORD
};
