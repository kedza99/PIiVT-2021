import BaseController from '../../common/BaseController';
import { Request, Response } from 'express';
import { IAddAnimator, IAddAnimatorValidator} from './dto/AddAnimator';
import Config from '../../config/dev';
import { v4 } from "uuid";
import { UploadedFile } from 'express-fileupload';
import sizeOf from "image-size";
import * as path from "path";
import * as sharp from "sharp";


class AnimatorController extends BaseController {
    public async getById(req: Request, res: Response) {
        const id: number = +(req.params?.id);

        if (id <= 0) {
            res.sendStatus(400);
            return;
        }

        const item = await this.services.animatorService.getById(
            id      
        );

        if (item === null) {
            res.sendStatus(404);
            return;
        }

        res.send(item);
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

        const resizeforThumbs = Config.fileUpload.photos.resizes[1];
            const resizedImagePath = directory + "/" +
                                     filename +
                                     resizeforThumbs.sufix +
                                     extension;
            await sharp(imagePath)
                .resize({
                    width: resizeforThumbs.width,
                    height: resizeforThumbs.hieght,
                    fit: resizeforThumbs.fit,
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

    public async add(req: Request, res: Response) {
        const uploadedPhoto = await this.uploadFile(req, res);

        if (uploadedPhoto.length === 0) {
            return;
        }

        try {
            const data = JSON.parse(req.body?.data);

            if (!IAddAnimatorValidator(data)) {
                res.status(400).send(IAddAnimatorValidator.errors);
                return;
            }

            const result = await this.services.animatorService.add(data as IAddAnimator, uploadedPhoto);

            res.send(result);
        } catch (e) {
            res.status(400).send(e?.message);
        }
    }

    public async edit(req: Request, res: Response) {
        const id: number = +(req.params?.id);

        if (id <= 0) {
            return res.sendStatus(400);
        }

        if (!IAddAnimatorValidator(req.body)) {
            return res.status(400).send(IAddAnimatorValidator.errors);
        }

        const result = await this.services.animatorService.edit(id, req.body as IAddAnimator);

        if (result === null) {
            return res.sendStatus(404);
        }

        res.send(result);
    }

    public async deleteById(req: Request, res: Response) {
        const id: number = +(req.params?.id);

        if (id <= 0) {
            return res.sendStatus(400);
        }

        const item = await this.services.animatorService.getById(id);

        if (item === null) {
            res.sendStatus(404);
            return;
        }

        res.send(await this.services.animatorService.delete(id));
    }

    public async getAllBySpecialOfferId(req: Request, res: Response) {
        const id: number = +(req.params.id);
        if (id <= 0) return res.status(400).send("Invalid special offer ID value.");
        res.send(await this.services.animatorService.getAllBySpecialOfferId(id));
    }
}

export default AnimatorController;
