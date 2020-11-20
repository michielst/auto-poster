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
                    reject(image);
                }

                this.resize(body, filePath);

                resolve(image);
            })
        });
    }

    private static resize(image: any, filePath: string) {
        sharp(image).resize(1080, 1080, { fit: sharp.fit.contain }).toFile(filePath);
    }
}
