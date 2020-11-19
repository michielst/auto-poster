import env from './env.config';
import { Downloader, InstagramWrapper, Reddit, RedditPostResponse } from './util';

class AutoPoster {
    private reddit: Reddit;
    private instagram: InstagramWrapper;
    private downloader: Downloader;

    constructor() {
        this.reddit = new Reddit();
        this.instagram = new InstagramWrapper(env.instagramUsername, env.instagramPassword);
        this.downloader = new Downloader();
    }

    public async run() {
        this.reddit.getPosts(env.subreddit, 5).then(async posts => {
            posts.forEach(post => {
                this.downloader.image(`${post.data.name}.jpg`, post.data.url)
                    .then(filePath => {
                        this.instagram.client.login().then(async () => {
                            console.log(`uploading ${filePath} to @${env.instagramUsername}...`);
                            const caption = `${post.data.title} ${env.tags}`;
                            await this.instagram.client.uploadPhoto({ photo: filePath, caption, post: 'feed' });
                            console.log('done');
                        });
                    })
                    .catch(console.error);
            });
        }).catch(console.error);
    }
}

const bot = new AutoPoster();
bot.run();
