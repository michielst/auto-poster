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

                const action = sharp(body);
                action.metadata().then(metadata => {
                    if (metadata.width < 1080) {
                        action.resize(1080, 1080, { fit: sharp.fit.contain });
                    } else if (metadata.width <= 1080 && metadata.height > 1350) {
                        action.resize(1080, 1080, { fit: sharp.fit.contain });
                    } else if (metadata.width > 1080 && metadata.height > 1080) {
                        action.resize({ width: 1080, height: 1350, fit: sharp.fit.contain });
                    } else if (metadata.width > 1080) {
                        action.resize(1080, 1080, { fit: sharp.fit.contain });
                    } else {
                        action.resize({ width: 1080, fit: sharp.fit.cover });
                    }

                    action.toFile(filePath);
                });

                resolve(image);
            })
        });
    }
}
