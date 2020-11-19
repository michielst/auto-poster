import { Reddit, RedditPostResponse } from './util';

class AutoPoster {
    public reddit: Reddit;

    constructor() {
        this.reddit = new Reddit();
    }

    public run() {
        this.reddit.getPosts('', (posts: RedditPostResponse[]) => {
            posts.forEach(post => {
                console.log(post.data.title)
                console.log(post.data.permalink);
            });
        });
    }
}

const bot = new AutoPoster();
bot.run();