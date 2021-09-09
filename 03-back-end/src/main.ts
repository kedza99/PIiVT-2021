import * as express from "express";
import * as cors from  "cors";
import Config from './config/dev';
import SpecialOfferRouter from './components/special_offer/router';
import * as mysql2 from "mysql2/promise";
import IApplicationResources from './common/IApplicationResources.interface';
import Router from './router';
import * as fileUpload from "express-fileupload";
import AnimatorRouter from './components/animator/router';
import SpecialOfferService from "./components/special_offer/service";
import AnimatorService from "./components/animator/service";

async function main(){
const application: express.Application = express();

application.use(cors());
application.use(express.json());
application.use(fileUpload({
    limits: {
        fileSize: Config.fileUpload.maxSize,
        files: Config.fileUpload.maxFiles,
    },
    useTempFiles: true,
    tempFileDir: Config.fileUpload.temporaryDirectory,
    uploadTimeout: Config.fileUpload.timeout,
    safeFileNames: true,
    preserveExtension: true,
    createParentPath: true,
    abortOnLimit: true,
}));

const resources: IApplicationResources = {
    databaseConnection: await mysql2.createConnection({
        host: Config.database.host,
        port: Config.database.port,
        user: Config.database.user,
        password: Config.database.password,
        database: Config.database.database,
        charset: Config.database.charset,
        timezone: Config.database.timezone,
        supportBigNumbers: true,
    }),
}

resources.databaseConnection.connect();

resources.services = {
    specialOfferService:      new SpecialOfferService(resources),
    animatorService:       new AnimatorService(resources),
};

application.use(Config.server.static.route,
     express.static(Config.server.static.path,{
    index:Config.server.static.index,
    cacheControl:Config.server.static.cacheControl,
    maxAge:Config.server.static.maxAge,
    etag:Config.server.static.etag,
    dotfiles:Config.server.static.dotfiles,
}),);

Router.setupRoutes(application, resources, [
    new SpecialOfferRouter(),
    new AnimatorRouter(),

]);


application.use((req,res) => {
    res.sendStatus(404);
});
application.use((err, req, res, next) => {
    res.status(err.status).send(err.type);
});

application.listen(Config.server.port); 
}

main();