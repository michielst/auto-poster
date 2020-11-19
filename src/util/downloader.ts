import request from 'request';
import sharp from 'sharp';

export class Downloader {
    image(fileName: string, url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const filePath = `downloads/${fileName}`;
            request({ url, encoding: null }, (error, response, body) => {
                if (!error) {
                    sharp(body).resize(1080, 1080, {fit: sharp.fit.contain}).toFile(filePath)
                    resolve(filePath);
                }

                reject();
            })
        });
    }
}
