import env from './env.config';
import { DownloadedImage, InstagramUpload, InstagramUploadType } from './models';
import { Data, Downloader, InstagramWrapper, Reddit } from './util';

class AutoPoster {
    private reddit: Reddit;
    private instagram: InstagramWrapper;
    private database: Data;

    constructor() {
        this.reddit = new Reddit();
        this.instagram = new InstagramWrapper(env.instagramUsername, env.instagramPassword);
        this.database = new Data();
    }

    public async run() {
        const posts$ = this.reddit.getPosts(env.subreddit, 10);
        posts$.then(posts => {
            this.database.all().then((uploads: InstagramUpload[]) => {
                const uniqueIds = uploads.map(x => x.unique_id);
                const filteredPosts = posts.filter(post => !uniqueIds.includes(post.data.name));
                const images$: Promise<DownloadedImage>[] = filteredPosts.map(post => Downloader.downloadImage(post.data.name, 'jpg', post.data.url));

                Promise.all(images$).then(images => {
                    console.log(`fetched ${images.length} images, starting upload...`);
                    this.instagram.client.login().then(() => {
                        images.forEach((image, index) => {
                            setTimeout(() => {
                                const caption = filteredPosts.find(post => post.data.name === image.name).data.title;
                                console.log(`uploading ${image.fileName} to @${env.instagramUsername}...`);
                                Promise.resolve(this.instagram.upload(image.filePath, caption, InstagramUploadType.Feed));
                                if (env.postOnStory) {
                                    Promise.resolve(this.instagram.upload(image.filePath, caption, InstagramUploadType.Story));
                                }
                                this.database.insert(image.name, `${caption} ${env.tags}`, image.fileName).then().catch(console.error);
                                console.log(`uploaded ${image.filePath} to @${env.instagramUsername}!`);
                            }, (env.timeoutSeconds * 1000) * (index + 1));
                        });
                    });
                }).catch(console.error);
            }).catch(console.error);
        }).catch(console.error);
    }
}

const bot = new AutoPoster();
setTimeout(() => bot.run(), 1000);
