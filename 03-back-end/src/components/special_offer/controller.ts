import SpecialOfferService from './service';
import {Request, Response, NextFunction} from "express";
import SpecialOfferModel from './model';

class SpecialOfferController {
    private specialOfferService: SpecialOfferService;

    constructor(specialOfferService: SpecialOfferService) {
        this.specialOfferService = specialOfferService;
    }

    async getAll(req: Request, res: Response, next: NextFunction){
        const specialoffers = await this.specialOfferService.getAll();

        res.send(specialoffers);
    }
}

export default SpecialOfferController;