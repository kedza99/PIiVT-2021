import * as express from "express";
import AnimatorDateController from './controller';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';

export default class AnimatorDateRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const animatorDateController: AnimatorDateController = new AnimatorDateController(resources);

        application.get("/animatorDate/:id",    animatorDateController.getById.bind(animatorDateController));
        application.post("/animatorDate",       animatorDateController.add.bind(animatorDateController));
        application.delete( "/animatorDate/:id",   animatorDateController.deleteById.bind(animatorDateController));
        application.get("/animator/:id/animatorDate",    animatorDateController.getAllByAnimatorId.bind(animatorDateController));

    }
}
