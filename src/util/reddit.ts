import fetch from 'node-fetch';

export const getPosts = (subreddit: string, count = 5) => {
    const url = `https://www.reddit.com/r/${subreddit}/hot/.json?count=${count}`;

    fetch(url, { method: 'GET' })
        .then((res) => res.json())
        .then((json) => {
            const items = json.data.children.filter((x) => !x.data.is_self);
            console.log(items[0]);
        });
};


