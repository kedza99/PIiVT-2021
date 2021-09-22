import * as express from "express";
import AnimatorController from './controller';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';

export default class AnimatorRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const animatorController: AnimatorController = new AnimatorController(resources);

        application.get("/animator/:id",    animatorController.getById.bind(animatorController));
        application.post("/animator",       animatorController.add.bind(animatorController));
        application.put( "/animator/:id",   animatorController.edit.bind(animatorController));
        application.delete( "/animator/:id",   animatorController.deleteById.bind(animatorController));
        application.get("/specialOffer/:sid/animator",    animatorController.getAllBySpecialOfferId.bind(animatorController));

    }
}
