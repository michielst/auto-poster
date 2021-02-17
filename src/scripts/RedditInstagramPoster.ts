import env from '../env.config';
import { DownloadedImage, InstagramUpload, InstagramUploadType, RedditPostResponse } from "../models";
import { Account } from '../util/config';
import { Data } from '../util/data';
import { Downloader } from '../util/downloader';
import { InstagramWrapper } from "../util/instagram";
import { Reddit } from "../util/reddit";

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

    public async run(databaseUploads?: InstagramUpload[]) {
        console.log(`Starting RedditInstagramPoster => @${this.account.instagramUsername}`)
        const posts = await this.reddit.getPosts();

        if (posts.length === 0) {
            console.error('no reddit posts found.');
            return;
        }

        let uploads = [];
        if (databaseUploads) {
            uploads = databaseUploads;
        } else {
            uploads = await this.database.all(1000);
        }

        const filteredPosts = posts
            .filter(post => !uploads.map(x => x.unique_id).includes(post.data.name))
            .slice(0, env.uploadsPerScriptRun);

        if (filteredPosts.length === 0) {
            return;
        }

        await this.uploadRedditPostsToInstagram(filteredPosts);
    }

    private async uploadRedditPostsToInstagram(posts: RedditPostResponse[]) {
        const images$: Promise<DownloadedImage>[] = posts.map(post => Downloader.downloadImage(post.data.name, 'jpg', this.getImageUrl(post)));
        const images = await Promise.all(images$);

        if (images.length === 0) {
            return;
        }

        console.log(`fetched ${images.length} images, starting upload...`);

        await this.instagram.client.login()
            .then(() => this.onInstagramLoginSuccess(posts, images))
            .catch((response: any) => this.instagram.onInstagramLoginError(response.error));
    }

    private getImageUrl(redditPost: RedditPostResponse) {
        let imageUrl = redditPost.data.url;

        if (redditPost.data.gallery_data) {
            imageUrl = `https://i.redd.it/${redditPost.data.gallery_data.items[0].media_id}.jpg`;
        }

        return imageUrl;
    }

    private async onInstagramLoginSuccess(posts, images) {
        images.forEach(async (image, index) => {
            await setTimeout(async () => {
                const post = posts.find(post => post.data.name === image.name);
                let caption = post.data.title;

                console.log(caption);

                if (this.account.credits) {
                    caption = `${caption} 

            -
            -
            -
            author: u/${post.data.author}
            thread: https://reddit.com${post.data.permalink}
            ${this.account.tags}`;
                } else {
                    caption = `${caption} 
            -
            ${this.account.tags}`;
                }

                console.log(`uploading ${image.fileName} to @${this.account.instagramUsername}...`);

                const { media } = await this.instagram.upload(image.filePath, caption, InstagramUploadType.Feed);
                console.log(`uploaded ${image.filePath} to @${this.account.instagramUsername} (${media.code})`);

                if (this.account.postOnStory) {
                    await this.instagram.upload(image.filePath, caption, InstagramUploadType.Story);
                }

                await this.database.insert(image.name, caption, image.fileName);
                console.log(`inserted ${image.fileName} into database`);

                console.log(`waiting ${env.timeoutInBetweenUploadsInSeconds} seconds before starting next upload.`);
            }, (env.timeoutInBetweenUploadsInSeconds * 1000) * ((index - 1) + 1));
        });
    }
}