import BaseController from '../../common/BaseController';
import { Request, Response } from 'express';
import { IAddAnimatorDate, IAddAnimatorDateValidator} from './dto/AddAnimatorDate';

class AnimatorDateController extends BaseController {
    public async getById(req: Request, res: Response) {
        const id: number = +(req.params?.id);

        if (id <= 0) {
            res.sendStatus(400);
            return;
        }

        const item = await this.services.animatorDateService.getById(
            id      
        );

        if (item === null) {
            res.sendStatus(404);
            return;
        }

        res.send(item);
    }

    async add(req: Request, res: Response) {
        const data = req.body;

        if (!IAddAnimatorDateValidator(data)) {
            res.status(400).send(IAddAnimatorDateValidator.errors);
            return;
        }

        const result = await this.services.animatorDateService.add(data as IAddAnimatorDate);

        res.send(result);
    }

    public async deleteById(req: Request, res: Response) {
        const id: number = +(req.params?.id);

        if (id <= 0) {
            return res.sendStatus(400);
        }

        const item = await this.services.animatorDateService.getById(id);

        if (item === null) {
            res.sendStatus(404);
            return;
        }

        res.send(await this.services.animatorDateService.delete(id));
    }

    public async getAllByAnimatorId(req: Request, res: Response) {
        const id: number = +(req.params.id);
        if (id <= 0) return res.status(400).send("Invalid animator ID value.");
        res.send(await this.services.animatorDateService.getAllByAnimatorId(id));
    }
}

export default AnimatorDateController;
