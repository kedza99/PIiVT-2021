import * as express from "express";
import AnimatorDateController from './controller';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';

export default class AnimatorDateRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const animatorDateController: AnimatorDateController = new AnimatorDateController(resources);

        application.get("/animatorDate/:id",  AuthMiddleware.getVerifier(), animatorDateController.getById.bind(animatorDateController));
        application.post("/animatorDate", animatorDateController.add.bind(animatorDateController));
        application.delete( "/animatorDate/:id", AuthMiddleware.getVerifier(), animatorDateController.deleteById.bind(animatorDateController));
        application.get("/animator/:aid/animatorDate",  AuthMiddleware.getVerifier(), animatorDateController.getAllByAnimatorId.bind(animatorDateController));

    }
}
