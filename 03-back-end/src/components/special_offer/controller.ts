import SpecialOfferService from './service';
import {Request, Response, NextFunction} from "express";
import SpecialOfferModel from './model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddSpecialOffer, IAddSpecialOfferValidator } from './dto/AddSpecialOffer';


class SpecialOfferController {
    private specialOfferService: SpecialOfferService;

    constructor(specialOfferService: SpecialOfferService) {
        this.specialOfferService = specialOfferService;
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const categories = await this.specialOfferService.getAll();

        res.send(categories);
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const id: string = req.params.id;

        const specialOfferId: number = +id;

        if (specialOfferId <= 0) {
            res.sendStatus(400);
            return;
        }
 
        const data: SpecialOfferModel|null|IErrorResponse = await this.specialOfferService.getById(specialOfferId);

        if (data === null) {
            res.sendStatus(404);
            return;
        }

        if (data instanceof SpecialOfferModel) {
            res.send(data);
            return;
        }

        res.status(500).send(data);
    }

    async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddSpecialOfferValidator(data)) {
            res.status(400).send(IAddSpecialOfferValidator.errors);
            return;
        }

        const result = await this.specialOfferService.add(data as IAddSpecialOffer);

        res.send(result);
    }

    async edit(req: Request, res: Response, next: NextFunction) {
        const id: string = req.params.id;

        const specialOfferId: number = +id;

        if (specialOfferId <= 0) {
            res.status(400).send("Invalid ID number.");
            return;
        }

        const data = req.body;

        if (!IAddSpecialOfferValidator(data)) {
            res.status(400).send(IAddSpecialOfferValidator.errors);
            return;
        }

        const result = await this.specialOfferService.edit(
            specialOfferId,
            data as IAddSpecialOffer,
           
        );

        if (result === null) {
            res.sendStatus(404);
            return;
        }

        res.send(result);
    }

    async deleteById(req: Request, res: Response, next: NextFunction) {
        const id: string = req.params.id;

        const specialOfferId: number = +id;

        if (specialOfferId <= 0) {
            res.status(400).send("Invalid ID number.");
            return;
        }

        res.send(await this.specialOfferService.delete(specialOfferId));
    }
}

export default SpecialOfferController;