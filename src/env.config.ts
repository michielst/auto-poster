import * as dotenv from 'dotenv';
dotenv.config();

export default {
    database: process.env.DATABASE_NAME,
    uploadsPerScriptRun: Number(process.env.UPLOADS_PER_SCRIPT_RUN),
    timeoutInBetweenUploadsInSeconds: Number(process.env.TIMOUT_IN_BETWEEN_UPLOADS_IN_SECONDS),
    useCookieStore: Boolean(JSON.parse(process.env.USE_COOKIE_STORE))
};
