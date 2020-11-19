import Instagram from 'instagram-web-api';

export class InstagramWrapper {
    public client: Instagram;

    constructor(username: string, password: string) {
        this.client = new Instagram({ username, password })
    }
}
