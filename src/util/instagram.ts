import Instagram from 'instagram-web-api';
import { InstagramUploadType } from '../models';

const FileCookieStore = require('tough-cookie-filestore2');

export class InstagramWrapper {
    public client: Instagram;

    constructor(username: string, password: string) {
        const cookieStore = new FileCookieStore('./cookies.json')
        this.client = new Instagram({ username, password, cookieStore });
    }

    public async upload(photo: string, caption: string, type: InstagramUploadType) {
        return this.client.uploadPhoto({ photo, caption, post: type });
    }
}
