import fetch from 'node-fetch';
import { RedditPostResponse } from '../models';


export class Reddit {
    public REDDIT_URL = 'https://www.reddit.com';
    private subreddit;

    constructor(subreddit: string) {
        this.subreddit = subreddit;
    }

    getPosts(limit = 50): Promise<RedditPostResponse[]> {
        return new Promise(async (resolve, reject) => {
            fetch(`${this.REDDIT_URL}/r/${this.subreddit}/top/.json?t=week&limit=${limit}`, { method: 'GET' })
                .then(res => res.json())
                .then(json => resolve(json.data.children.filter((post: RedditPostResponse) => !post.data.is_self && !post.data.is_video)))
                .catch(reject);
        })
    }
}
