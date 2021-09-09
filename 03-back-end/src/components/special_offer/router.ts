import * as express from "express";
import SpecialOfferService from './service';
import SpecialOfferController from './controller';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';

export default class SpecialOfferRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const specialOfferController: SpecialOfferController = new SpecialOfferController(resources);

        application.get("/specialOffer",    specialOfferController.getAll.bind(specialOfferController));
        application.get("/specialOffer/:id",    specialOfferController.getById.bind(specialOfferController));
        application.post("/specialOffer",       specialOfferController.add.bind(specialOfferController));
        application.put( "/specialOffer/:id",   specialOfferController.edit.bind(specialOfferController));
        application.delete( "/specialOffer/:id",   specialOfferController.deleteById.bind(specialOfferController));    
    }
}
