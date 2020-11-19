import fetch from 'node-fetch';

export interface RedditPostResponse {
    kind: string;
    data: RedditPost
}

interface RedditPost {
    title: string;
    permalink: string;
    author: string;
    is_self: boolean;
}

export class Reddit {
    getPosts(subreddit: string, callback: (posts: RedditPostResponse[]) => void, limit = 5) {
        return fetch(`https://www.reddit.com/r/${subreddit}/hot/.json?limit=${limit}`, { method: 'GET' })
            .then((res) => res.json())
            .then((json) => {
                const posts: RedditPostResponse[] = json.data.children.filter((post: RedditPostResponse) => !post.data.is_self);
                callback(posts);
            });
    };
}
