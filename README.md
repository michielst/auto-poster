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
            "postOnStory": false,
            "credits": true
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

### What to do when receiving challenges

When supsicious behaviour is found on your account, Instagram will provide a challenge for you to complete. This can be a verification via SMS or email (Whichever is linked to your account). The bot will not be able to post when this is happening.

To fix this:

- Sign into the account with your phone and verify via SMS.
- Delete the `{account}_cookies.json` for this account.
- Run the verifier script `npm run verifier <username>`. This will send a verification request to your email with a code that you have to enter in the command prompt. (This will also create a new cookies.json file for this account)
- Run `npm start` again.
