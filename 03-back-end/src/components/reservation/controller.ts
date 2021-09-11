import BaseController from '../../common/BaseController';
import { Request, Response } from 'express';
import { IAddReservation, IAddReservationValidator} from './dto/AddReservation';
import { IEditReservation, IEditReservationValidator} from './dto/EditReservation';

class ReservationController extends BaseController {
    public async getById(req: Request, res: Response) {
        const id: number = +(req.params?.id);

        if (id <= 0) {
            res.sendStatus(400);
            return;
        }

        const item = await this.services.reservationService.getById(
            id      
        );

        if (item === null) {
            res.sendStatus(404);
            return;
        }

        res.send(item);
    }

    public async edit(req: Request, res: Response) {
        const id = +(req.params.id);

        if (id <= 0) return res.status(400).send("The ID value cannot be smaller than 1.");

        if (!IEditReservationValidator(req.body)) {
            return res.status(400).send(IEditReservationValidator.errors);
        }

        const result = await this.services.reservationService.edit(id, req.body as IEditReservation);

        if (result === null) return res.sendStatus(404);

        res.send(result);
    }

    async add(req: Request, res: Response) {
        const data = req.body;

        if (!IAddReservationValidator(data)) {
            res.status(400).send(IAddReservationValidator.errors);
            return;
        }

        const result = await this.services.reservationService.add(data as IAddReservation);

        res.send(result);
    }

    public async deleteById(req: Request, res: Response) {
        const id: number = +(req.params?.id);

        if (id <= 0) {
            return res.sendStatus(400);
        }

        const item = await this.services.reservationService.getById(id);

        if (item === null) {
            res.sendStatus(404);
            return;
        }

        res.send(await this.services.reservationService.delete(id));
    }

    public async getAllByAnimatorDateId(req: Request, res: Response) {
        const id: number = +(req.params.id);
        if (id <= 0) return res.status(400).send("Invalid animatorDate ID value.");
        res.send(await this.services.reservationService.getAllByAnimatorDateId(id));
    }
}

export default ReservationController;
