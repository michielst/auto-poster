import fetch from 'node-fetch';

export interface RedditPostResponse {
    kind: string;
    data: RedditPost
}

interface RedditPost {
    title: string;
    name: string;
    permalink: string;
    author: string;
    is_self: boolean;
    url: string;
}

export class Reddit {
    public REDDIT_URL = 'https://www.reddit.com';

    getPosts(subreddit, limit = 5): Promise<RedditPostResponse[]> {
        return new Promise(async (resolve, reject) => {
            fetch(`${this.REDDIT_URL}/r/${subreddit}/hot/.json?limit=${limit}`, { method: 'GET' })
                .then(res => res.json())
                .then(json => resolve(json.data.children.filter((post: RedditPostResponse) => !post.data.is_self)))
                .catch(reject);
        })
    }
}
