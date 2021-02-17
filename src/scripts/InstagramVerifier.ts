import { Config } from "../util/config";
import { InstagramWrapper } from "../util/instagram";


class InstagramVerifier {
    private config: Config;
    private instagram: InstagramWrapper;

    constructor() {
        this.config = new Config();

        const username = process.argv[2];
        const account = this.config.settings.accounts.find(x => x.instagramUsername === username);

        if (!account) {
            console.log(`Account '${username}' not found in settings.json.`)
            process.exit();
        }

        this.instagram = new InstagramWrapper(account.instagramUsername, account.instagramPassword);
    }

    start() {
        this.instagram.client.login()
            .then(() => console.log('no verification needed.'))
            .catch((response: any) => this.instagram.onInstagramLoginError(response.error));
    }
}

const verifier = new InstagramVerifier();
verifier.start();