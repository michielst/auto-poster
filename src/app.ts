import { RedditInstagramPoster } from './scripts';
import { Data } from './util';
import { Config } from './util/config';
import env from './env.config';


class AutoPoster {
    private config: Config;
    private database: Data;

    constructor() {
        this.config = new Config();
        this.database = new Data();
    }

    public async run() {
        const limit = (12 * 7) * this.config.settings.accounts.length;
        const posts = await this.database.all(limit);

        this.config.settings.accounts.forEach((account, index) => {
            setTimeout(() => {
                const redditInstagramPoster = new RedditInstagramPoster(this.database, account);
                redditInstagramPoster.run(posts);
            }, ((env.timeoutInBetweenUploadsInSeconds * env.uploadsPerScriptRun) * 1000) * ((index - 1) + 1))
        });
    }
}

const bot = new AutoPoster();
setTimeout(() => bot.run(), 1000);
