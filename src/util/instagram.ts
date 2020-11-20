import Instagram from 'instagram-web-api';
import { InstagramUploadType } from '../models';


export class InstagramWrapper {
    public client: Instagram;

    constructor(username: string, password: string) {
        this.client = new Instagram({ username, password })
    }

    public async upload(photo: string, caption: string, type: InstagramUploadType) {
        await this.client.uploadPhoto({ photo, caption, post: type });
    }
}
