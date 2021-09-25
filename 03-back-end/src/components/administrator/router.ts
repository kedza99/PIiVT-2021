import IRouter from '../../common/IRouter.interface';
import { Application } from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import AdministratorController from './controller';
import AuthMiddleware from '../../middleware/auth.middleware';
export default class AdministratorRouter implements IRouter {
    public setupRoutes(application: Application, resources: IApplicationResources) {
        const administratorController = new AdministratorController(resources);

        application.get("/administrator", AuthMiddleware.getVerifier(),  administratorController.getAll.bind(administratorController));
        application.get("/administrator/:id", AuthMiddleware.getVerifier(), administratorController.getById.bind(administratorController));
        application.post("/administrator", AuthMiddleware.getVerifier(),  administratorController.add.bind(administratorController));
        application.put("/administrator/:id", AuthMiddleware.getVerifier(), administratorController.edit.bind(administratorController));
        application.delete("/administrator/:id", AuthMiddleware.getVerifier(), administratorController.delete.bind(administratorController));
    }
}
