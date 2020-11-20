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
