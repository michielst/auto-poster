# auto-poster

Automatically post images from a subreddit to an instagram account.

### Setup

1. Create a copy of the `.env.example` file to `.env` and enter your environment variables.
2. Create a `settings.json` file in the root with your account credentials. Example:

```
{
    "accounts": [
        {
            "instagramUsername": "",
            "instagramPassword": "",
            "subreddit": "",
            "tags": "",
            "postOnStory": false
        }
    ]
}
```

3. Run the following commands:

```
npm install
npm start
```

### Setup via cron (linux)

1. Make the cron scrip executable.

```
chmod +x /home/ubuntu/projects/auto-poster/cron.sh
```

2. Add this to your crontab using `crontab -e`. This will run the script every 12 hours.

```
0 */12 * * * sh /home/ubuntu/projects/auto-poster/cron.sh
```
