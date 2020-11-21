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
        this.config.settings.accounts.forEach((account, index) => {
            setTimeout(() => {
                const redditInstagramPoster = new RedditInstagramPoster(this.database, account);
                redditInstagramPoster.run();
            }, (env.timeoutInBetweenUploadsInSeconds * 1000) * (index + 1))
        });
    }
}

const bot = new AutoPoster();
setTimeout(() => bot.run(), 1000);
