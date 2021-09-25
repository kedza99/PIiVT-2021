import * as express from "express";
import SpecialOfferController from './controller';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';
export default class SpecialOfferRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const specialOfferController: SpecialOfferController = new SpecialOfferController(resources);

        application.get("/specialOffer",    specialOfferController.getAll.bind(specialOfferController));
        application.get("/specialOffer/:id",    specialOfferController.getById.bind(specialOfferController));
        application.post("/specialOffer", AuthMiddleware.getVerifier(), specialOfferController.add.bind(specialOfferController));
        application.put( "/specialOffer/:id", AuthMiddleware.getVerifier(), specialOfferController.edit.bind(specialOfferController));
        application.delete( "/specialOffer/:id", AuthMiddleware.getVerifier(), specialOfferController.deleteById.bind(specialOfferController));    
    }
}
