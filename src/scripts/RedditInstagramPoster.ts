import env from '../env.config';
import { DownloadedImage, InstagramUploadType, RedditPostResponse } from "../models";
import { Data, Downloader, InstagramWrapper, Reddit } from "../util";
import { Account } from '../util/config';


export class RedditInstagramPoster {
    private database: Data;
    private account: Account;
    private reddit: Reddit;
    private instagram: InstagramWrapper;

    constructor(database: Data, account: Account) {
        this.database = database;
        this.account = account;
        this.reddit = new Reddit(account.subreddit);
        this.instagram = new InstagramWrapper(account.instagramUsername, account.instagramPassword);
    }

    public run() {
        console.log(`Starting RedditInstagramPoster => @${this.account.instagramUsername}`)

        this.reddit.getPosts().then(posts => {
            this.database.all().then(uploads => {
                const uniqueIds = uploads.map(x => x.unique_id);
                const filteredPosts = posts.filter(post => !uniqueIds.includes(post.data.name)).slice(0, env.uploadsPerScriptRun);
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
                            caption = `${caption}  ${this.account.tags}`;
                            console.log(`uploading ${image.fileName} to @${this.account.instagramUsername}...`);
                            Promise.resolve(this.instagram.upload(image.filePath, caption, InstagramUploadType.Feed));
                            if (this.account.postOnStory) {
                                Promise.resolve(this.instagram.upload(image.filePath, caption, InstagramUploadType.Story));
                            }
                            this.database.insert(image.name, caption, image.fileName).then().catch(console.error);
                            console.log(`uploaded ${image.filePath} to @${this.account.instagramUsername}!`);
                            console.log(`waiting ${env.timeoutInBetweenUploadsInSeconds} seconds before starting next upload.`);
                        }, (env.timeoutInBetweenUploadsInSeconds * 1000) * ((index - 1) + 1));
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