import env from './env.config';
import { DownloadedImage, Downloader, InstagramWrapper, Reddit } from './util';

class AutoPoster {
    private reddit: Reddit;
    private instagram: InstagramWrapper;

    constructor() {
        this.reddit = new Reddit();
        this.instagram = new InstagramWrapper(env.instagramUsername, env.instagramPassword);
    }

    public async run() {
        const posts$ = this.reddit.getPosts(env.subreddit, 10);
        posts$.then(posts => {
            const images$: Promise<DownloadedImage>[] = posts.map(post => Downloader.downloadImage(post.data.name, 'jpg', post.data.url));
            Promise.all(images$)
                .then(images => {
                    console.log(`fetched ${images.length} images, starting upload...`);
                    this.instagram.client.login().then(() => {
                        images.forEach((image, index) => {
                            setTimeout(async () => {
                                const caption = posts.find(post => post.data.name === image.name).data.title;
                                console.log(`uploading ${image.filePath} to @${env.instagramUsername}...`);
                                await this.instagram.client.uploadPhoto({ photo: image.filePath, caption, post: 'feed' });
                                console.log(`uploaded ${image.filePath} to @${env.instagramUsername}!`);
                            }, (env.timeoutSeconds * 1000) * (index + 1));
                        });
                    });
                })
                .catch(console.error);
        }).catch(console.error);
    }
}

const bot = new AutoPoster();
bot.run();
