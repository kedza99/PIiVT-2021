import * as express from "express";
import ReservationController from './controller';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';

export default class ReservationRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const reservationController: ReservationController = new ReservationController(resources);

        application.get("/reservation/:id", reservationController.getById.bind(reservationController));
        application.post("/reservation", reservationController.add.bind(reservationController));
        application.delete( "/reservation/:id", reservationController.deleteById.bind(reservationController));
        //??
        application.get("/animatorDate/:aid/reservation", AuthMiddleware.getVerifier(), reservationController.getAllByAnimatorDateId.bind(reservationController));
        //??
        application.put("/reservation/:id", reservationController.edit.bind(reservationController));

    }
}
