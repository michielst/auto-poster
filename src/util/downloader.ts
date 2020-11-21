import request from 'request';
import sharp from 'sharp';
import { DownloadedImage } from '../models';


export abstract class Downloader {
    public static downloadImage(name: string, extension: string, url: string): Promise<DownloadedImage> {
        return new Promise((resolve, reject) => {
            const fileName = `${name}.${extension}`;
            const filePath = `downloads/${fileName}`;

            request({ url, encoding: null }, (error, response: any, body: any) => {
                const image = { name, fileName, filePath } as DownloadedImage;

                if (error) {
                    reject();
                }

                // sharp(body).metadata().then(console.log);
                sharp(body).resize({ width: 1080, fit: sharp.fit.cover }).toFile(filePath);

                resolve(image);
            })
        });
    }
}
