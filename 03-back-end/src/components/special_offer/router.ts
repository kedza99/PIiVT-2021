import * as express from "express";
import SpecialOfferService from './service';
import SpecialOfferController from './controller';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';

export default class SpecialOfferRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const specialOfferService: SpecialOfferService = new SpecialOfferService(resources.databaseConnection);
        const specialOfferController: SpecialOfferController = new SpecialOfferController(specialOfferService);

        application.get("/specialOffer",    specialOfferController.getAll.bind(specialOfferController));
       
    }
}
