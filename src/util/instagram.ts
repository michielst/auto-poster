import Instagram from 'instagram-web-api';
import readline from 'readline';
import FileCookieStore from 'tough-cookie-filestore2';
import envConfig from '../env.config';
import { InstagramUploadType } from '../models';

export class InstagramWrapper {
    public client: Instagram;

    constructor(username: string, password: string) {
        if (envConfig.useCookieStore) {
            const cookieStore = new FileCookieStore(`./cookies/${username}_cookies.json`)
            this.client = new Instagram({ username, password, cookieStore });
        } else {
            this.client = new Instagram({ username, password });
        }
    }

    public async upload(photo: string, caption: string, type: InstagramUploadType) {
        return this.client.uploadPhoto({ photo, caption, post: type });
    }

    public onInstagramLoginError(error) {
        console.log(error);
        console.log('Requesting verification code via email.');

        if (!error) {
            return;
        }

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.client.updateChallenge({ challengeUrl: error.checkpoint_url, choice: 1 }).then(res => {
            rl.question('Enter the verification code from the instagram verification email:', async securityCode => {
                if (securityCode) {
                    console.log(`Sending ${securityCode} as verification request.`)
                    this.client.updateChallenge({ challengeUrl: error.checkpoint_url, securityCode }).then(async result => {
                        rl.close();
                        this.client.logout().then(res => console.log(res)).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }

                rl.close();
            });
        });
    }
}
