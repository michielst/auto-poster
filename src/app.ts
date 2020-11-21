import { RedditInstagramPoster } from './scripts';
import { Data } from './util';
import { Config } from './util/config';


class AutoPoster {
    private config: Config;
    private database: Data;

    constructor() {
        this.config = new Config();
        this.database = new Data();
    }

    public async run() {
        this.config.settings.accounts.forEach(account => {
            const redditInstagramPoster = new RedditInstagramPoster(this.database, account);
            redditInstagramPoster.run();
        });
    }
}

const bot = new AutoPoster();
setTimeout(() => bot.run(), 1000);
