# auto-poster

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
