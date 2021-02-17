import env from './env.config';
import { RedditInstagramPoster } from './scripts';
import { Config } from './util/config';
import { Data } from './util/data';


class AutoPoster {
    private config: Config;
    private database: Data;

    constructor() {
        this.config = new Config();
        this.database = new Data();
    }

    public run() {
        const limit = (12 * 7) * this.config.settings.accounts.length;
        this.database.all(limit).then(posts => {
            this.config.settings.accounts.forEach((account, index) => {
                setTimeout(async () => {
                    const redditInstagramPoster = new RedditInstagramPoster(this.database, account);
                    await redditInstagramPoster.run(posts);
                }, ((env.timeoutInBetweenUploadsInSeconds * env.uploadsPerScriptRun) * 1000) * ((index - 1) + 1))
            });
        }).catch(err => console.error(err));
    }
}

const bot = new AutoPoster();
bot.run();
