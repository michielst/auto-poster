export interface RedditPostResponse {
    kind: string;
    data: RedditPost
}

interface RedditPost {
    title: string;
    name: string;
    permalink: string;
    author: string;
    is_self: boolean;
    is_video: boolean;
    url: string;
    score: number;
    gallery_data: RedditGalleryData;
}

interface RedditGalleryData {
    items: RedditGalleryDataItem[];
}

interface RedditGalleryDataItem {
    media_id: string;
}