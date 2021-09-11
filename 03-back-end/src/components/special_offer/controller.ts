
import {Request, Response, NextFunction} from "express";
import SpecialOfferModel from './model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddSpecialOffer, IAddSpecialOfferValidator } from './dto/AddSpecialOffer';
import BaseController from '../../common/BaseController';
import Config from '../../config/dev';
import { v4 } from "uuid";
import { UploadedFile } from 'express-fileupload';
import sizeOf from "image-size";
import * as path from "path";
import * as sharp from "sharp";

class SpecialOfferController extends BaseController{
   
    async getAll(req: Request, res: Response, next: NextFunction) {
        const categories = await this.services.specialOfferService.getAll();

        res.send(categories);
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const id: string = req.params.id;

        const specialOfferId: number = +id;

        if (specialOfferId <= 0) {
            res.sendStatus(400);
            return;
        }
 
        const data: SpecialOfferModel|null|IErrorResponse = await this.services.specialOfferService.getById(specialOfferId);

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

    private isPhotoValid(file: UploadedFile): { isOk: boolean; message?: string } {
        try {
            const size = sizeOf(file.tempFilePath);

            const limits = Config.fileUpload.photos.limits;

            if (size.width < limits.minWidth) {
                return {
                    isOk: false,
                    message: `The img must have a width of at least ${limits.minWidth}px.`,
                }
            }

            if (size.height < limits.minHeight) {
                return {
                    isOk: false,
                    message: `The img must have a height of at least ${limits.minHeight}px.`,
                }
            }

            if (size.width > limits.maxWidth) {
                return {
                    isOk: false,
                    message: `The img must have a width of at most ${limits.maxWidth}px.`,
                }
            }

            if (size.height > limits.maxHeight) {
                return {
                    isOk: false,
                    message: `The img must have a height of at most ${limits.maxHeight}px.`,
                }
            }

            return {
                isOk: true,
            };
        } catch (e) {
            return {
                isOk: false,
                message: 'Bad file format.',
            };
        }
    }

    private async resizeUploadedPhoto(imagePath: string) {
        const pathParts = path.parse(imagePath);

        const directory = pathParts.dir;
        const filename  = pathParts.name;
        const extension = pathParts.ext;

        const resizeforBackground = Config.fileUpload.photos.resizes[0];
            const resizedImagePath = directory + "/" +
                                     filename +
                                     resizeforBackground.sufix +
                                     extension;
            await sharp(imagePath)
                .resize({
                    height: resizeforBackground.hieght,
                    fit: resizeforBackground.fit,
                    background: { r: 255, g: 255, b: 255, alpha: 1.0, },
                    withoutEnlargement: true,
                })
                .toFile(resizedImagePath);
        
    }

    private async uploadFile(req: Request, res: Response): Promise<string> {
        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).send("You must upload at least one photo.");
            return "";
        }

        const fileKeys: string[] = Object.keys(req.files);

        for (const fileKey of fileKeys) {
            const file = req.files[fileKey] as any;

            const result = this.isPhotoValid(file);

            if (result.isOk === false) {
                res.status(400).send(`Error with image ${fileKey}: "${result.message}".`);
                return "";
            }

            const randomString = v4();
            const originalName = file?.name;
            const now = new Date();

            const imagePath = Config.fileUpload.uploadDestinationDirectory +
                              (Config.fileUpload.uploadDestinationDirectory.endsWith("/") ? "" : "/") +
                              now.getFullYear() + "/" +
                              ((now.getMonth() + 1) + "").padStart(2, "0") + "/" +
                              randomString + "-" + originalName;

            await file.mv(imagePath);
            await this.resizeUploadedPhoto(imagePath);

            return imagePath;
        }

      
    }

    async add(req: Request, res: Response, next: NextFunction) {
        const uploadedPhoto = await this.uploadFile(req, res);

        if (uploadedPhoto.length === 0) {
            return;
        }

        try {
            const data = JSON.parse(req.body?.data);

            if (!IAddSpecialOfferValidator(data)) {
                res.status(400).send(IAddSpecialOfferValidator.errors);
                return;
            }

            const result = await this.services.specialOfferService.add(data as IAddSpecialOffer, uploadedPhoto);

            res.send(result);
        } catch (e) {
            res.status(400).send(e?.message);
        }
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

        const result = await this.services.specialOfferService.edit(
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

        res.send(await this.services.specialOfferService.delete(specialOfferId));
    }
}

export default SpecialOfferController;