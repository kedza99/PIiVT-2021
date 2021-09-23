import IConfig from '../common/IConfig.interface';
import { readFileSync } from 'fs';

const Config: IConfig = {
    server: {
        port: 4080,
        static: {
            route: "/static",
            path: "./static/",
            cacheControl: false,
            dotfiles: "deny",
            etag: false,
            index: false,
            maxAge: 360000
        }
    },
    database: {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "root",
        database: "aplikacija_animatori",
        charset: "utf8",
        timezone: "+01:00",
    },
    fileUpload: {
        maxSize: 5 * 1024 * 1024,
        maxFiles: 1,
        timeout: 60000,
        temporaryDirectory: '../temp/',
        uploadDestinationDirectory: 'static/uploads/',
        photos: {
            limits: {
                minWidth: 320,
                minHeight: 200,
                maxWidth: 1920,
                maxHeight: 1440,
            },
            resizes: [
                {
                    sufix: "-offerBackground",
                    fit: "cover",
                    hieght: 1028,
                },
                {
                    sufix: "-thumb",
                    fit: "cover",
                    width: 250,
                    hieght: 200,
                },
            ],
        },
    },
    auth:{
        administrator:{
            algorithm:"RS256",
            issuer: "localhost",
            auth:{
                duration: 60 * 60 * 24 * 7,
                public: readFileSync("keystore/administrator-auth.public", "utf-8"),
                private: readFileSync("keystore/administrator-auth.private", "utf-8")
            },
            refresh:{
                duration: 60 * 60 * 24 * 365,
                public: readFileSync("keystore/administrator-refresh.public", "utf-8"),
                private: readFileSync("keystore/administrator-refresh.private", "utf-8")
            }
        },
        allowRequestsEvenWithoutValidTokens: false
    }
};

export default Config;