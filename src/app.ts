import env from './env.config';
import { DownloadedImage, Downloader, InstagramUploadType, InstagramWrapper, Reddit } from './util';

class AutoPoster {
    private reddit: Reddit;
    private instagram: InstagramWrapper;

    constructor() {
        this.reddit = new Reddit();
        this.instagram = new InstagramWrapper(env.instagramUsername, env.instagramPassword);
    }

    public async run() {
        const posts$ = this.reddit.getPosts(env.subreddit, 1);

        posts$.then(posts => {
            const images$: Promise<DownloadedImage>[] = posts.map(post => Downloader.downloadImage(post.data.name, 'jpg', post.data.url));

            Promise.all(images$).then(images => {
                console.log(`fetched ${images.length} images, starting upload...`);
                this.instagram.client.login().then(() => {
                    images.forEach((image, index) => {
                        setTimeout(() => {
                            const caption = posts.find(post => post.data.name === image.name).data.title;
                            console.log(`uploading ${image.filePath} to @${env.instagramUsername}...`);
                            Promise.resolve(this.instagram.upload(image.filePath, caption, InstagramUploadType.Feed));
                            if (env.postOnStory) {
                                Promise.resolve(this.instagram.upload(image.filePath, caption, InstagramUploadType.Story));
                            }
                            console.log(`uploaded ${image.filePath} to @${env.instagramUsername}!`);
                        }, (env.timeoutSeconds * 1000) * (index + 1));
                    });
                });
            }).catch(console.error);
        }).catch(console.error);
    }
}

const bot = new AutoPoster();
bot.run();
