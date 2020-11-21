import env from './env.config';
import { DownloadedImage, InstagramUpload, InstagramUploadType, RedditPostResponse } from './models';
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
        this.reddit.getPosts(env.subreddit).then(posts => {
            this.database.all().then(uploads => {
                const uniqueIds = uploads.map(x => x.unique_id);
                const filteredPosts = posts.filter(post => !uniqueIds.includes(post.data.name)).slice(0, env.uploadsCount);
                this.uploadRedditPostsToInstagram(filteredPosts);
            }).catch(console.error);
        }).catch(console.error);
    }

    private uploadRedditPostsToInstagram(posts: RedditPostResponse[]) {
        const images$: Promise<DownloadedImage>[] = posts.map(post => Downloader.downloadImage(post.data.name, 'jpg', this.getImageUrl(post)));

        Promise.all(images$).then(images => {
            if (images.length > 0) {
                console.log(`fetched ${images.length} images, starting upload...`);
                this.instagram.client.login().then(() => {
                    images.forEach((image, index) => {
                        setTimeout(() => {
                            let caption = posts.find(post => post.data.name === image.name).data.title;
                            caption = `${caption}  ${env.tags}`;
                            console.log(`uploading ${image.fileName} to @${env.instagramUsername}...`);
                            Promise.resolve(this.instagram.upload(image.filePath, caption, InstagramUploadType.Feed));
                            if (env.postOnStory) {
                                Promise.resolve(this.instagram.upload(image.filePath, caption, InstagramUploadType.Story));
                            }
                            this.database.insert(image.name, caption, image.fileName).then().catch(console.error);
                            console.log(`uploaded ${image.filePath} to @${env.instagramUsername}!`);
                        }, (env.timeoutSeconds * 1000) * (index + 1));
                    });
                });
            }
        }).catch(console.error);
    }

    private getImageUrl(redditPost: RedditPostResponse) {
        let imageUrl = redditPost.data.url;

        if (redditPost.data.gallery_data) {
            imageUrl = `https://i.redd.it/${redditPost.data.gallery_data.items[0].media_id}.jpg`;
        }

        return imageUrl;
    }
}

const bot = new AutoPoster();
setTimeout(() => bot.run(), 1000);
