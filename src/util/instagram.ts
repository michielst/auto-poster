import Instagram from 'instagram-web-api';
import { InstagramUploadType } from '../models';

const FileCookieStore = require('tough-cookie-filestore2');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

export class InstagramWrapper {
    public client: Instagram;

    constructor(username: string, password: string) {
        const cookieStore = new FileCookieStore('./cookies.json')
        this.client = new Instagram({ username, password, cookieStore });
    }

    public async upload(photo: string, caption: string, type: InstagramUploadType) {
        return this.client.uploadPhoto({ photo, caption, post: type });
    }

    public onInstagramLoginError(error) {
        console.log('Requesting verification code via email.')
        this.client.updateChallenge({ challengeUrl: error.checkpoint_url, choice: 1 }).then(res => {
            readline.question('Enter the verification code from the instagram verification email:', async securityCode => {
                if (securityCode) {
                    console.log(`Sending ${securityCode} as verification request.`)
                    this.client.updateChallenge({ challengeUrl: error.checkpoint_url, securityCode }).then(async result => {
                        readline.close();
                        this.client.logout().then(res => console.log(res)).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }

                readline.close();
            });
        });
    }
}
