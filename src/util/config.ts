import fs from 'fs';


export interface Settings {
    accounts: Account[]
}

export interface Account {
    instagramUsername: string;
    instagramPassword: string;
    subreddit: string;
    tags: string;
    postOnStory: boolean;
}

export class Config {
    settings: Settings;

    constructor() {
        this.settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
    }
}