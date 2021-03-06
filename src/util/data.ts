import { Database } from 'sqlite3';
import env from '../env.config';
import { InstagramUpload } from '../models';


export class Data {
    private INSTAGRAM_UPLOADS_TABLE = 'instagram_uploads';

    constructor() {
        const db = this.connect();
        db.serialize(() => {
            db.get(`SELECT * FROM sqlite_sequence WHERE name='${this.INSTAGRAM_UPLOADS_TABLE}';`, (error, result) => {
                if (error) {
                    db.run(`CREATE TABLE "instagram_uploads" (
                        "id"	INTEGER NOT NULL UNIQUE,
                        "unique_id"	TEXT NOT NULL UNIQUE,
                        "title"	TEXT NOT NULL,
                        "file_path"	TEXT NOT NULL UNIQUE,
                        PRIMARY KEY("id" AUTOINCREMENT)
                    )`);

                    console.log('Created database tables');
                }

                this.close(db);
            })
        });
    }

    connect(): Database {
        return new Database(env.database, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log(`Connected to ${env.database}.`);
        });
    }

    close(db: Database): void {
        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    }

    all(limit: number = 100): Promise<InstagramUpload[]> {
        return new Promise<InstagramUpload[]>((resolve, reject) => {
            const db = this.connect();

            db.serialize(() => {
                db.all(`select * from instagram_uploads order by id desc limit ${limit}`, (error, results: InstagramUpload[]) => {
                    this.close(db);

                    if (error) {
                        reject(error);
                    }

                    resolve(results);
                });
            });
        });
    }

    insert(uniqueId: string, title: string, filePath: string): Promise<any> {
        return new Promise<InstagramUpload[]>((resolve, reject) => {
            const db = new Database(env.database, (err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log(`Connected to ${env.database}.`);
            });

            db.serialize(() => {
                db.run(`insert into ${this.INSTAGRAM_UPLOADS_TABLE} (unique_id, title, file_path) values (?,?, ?)`, [uniqueId, title, filePath], (error, result) => {
                    if (error) {
                        reject(error);
                    }

                    resolve(result);
                });
            });

            db.close((err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('Close the database connection.');
            });
        });
    }

    // get(uniqueId: string): Promise<InstagramUpload> {
    //     const sql = `select * from instagram_uploads where unique_id = ?`;

    //     return new Promise((resolve, reject) => {
    //         this.db.get(sql, [uniqueId], (error, result: InstagramUpload) => {
    //             if (error) {
    //                 reject(error);
    //             }

    //             resolve(result);
    //         });
    //     });
    // }
}