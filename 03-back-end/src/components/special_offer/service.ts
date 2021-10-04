import SpecialOfferModel from './model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddSpecialOffer} from './dto/AddSpecialOffer';
import BaseService from '../../common/BaseService';
import * as fs from "fs";
import * as path from 'path';
import Config from '../../config/dev';

class SpecialOfferService extends BaseService<SpecialOfferModel>{

    protected async adaptModel(row: any): Promise<SpecialOfferModel> {
        const item: SpecialOfferModel = new SpecialOfferModel();

        item.specialOfferId = +(row?.special_offer_id);
        item.name = row?.name;
        item.description = row?.description;
        item.videoURL = row?.video_url;
        item.imagePath = row?.image_path;

        return item;
    }

    public async getAll(): Promise<SpecialOfferModel[]|IErrorResponse> {
        return await this.getAllFromTable(
            'special_offer',
        );
    }

    public async getAllBySpecialOfferName(name: string): Promise<SpecialOfferModel[]|IErrorResponse> {
        return await this.getAllByFieldNameFromTable(
            'special_offer',
            'name',
            name    
        );
    }

    public async getById(specialOfferId: number): Promise<SpecialOfferModel|null|IErrorResponse> {
        return await this.getByIdFromTable("special_offer", specialOfferId);
    }

    public async add(data: IAddSpecialOffer, uploadedPhoto: string): Promise<SpecialOfferModel|IErrorResponse> {
        return new Promise<SpecialOfferModel|IErrorResponse>(async resolve => {
            const sql = `
                INSERT
                    special_offer
                SET
                    name = ?,
                    description = ?,
                    video_url = ?,
                    image_path = ?;`;

            this.db.execute(sql, [ data.name, data.description, data.videoURL, uploadedPhoto ])
                .then(async result => {
                    // const [ insertInfo ] = result;
                    const insertInfo: any = result[0];

                    const newSpecialOfferId: number = +(insertInfo?.insertId);
                    resolve(await this.getById(newSpecialOfferId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    public async edit(
        specialOfferId: number,
        data: IAddSpecialOffer
        
    ): Promise<SpecialOfferModel|IErrorResponse|null> {
        const result = await this.getById(specialOfferId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof SpecialOfferModel)) {
            return result;
        }

        return new Promise<SpecialOfferModel|IErrorResponse>(async resolve => {
            const sql = `
                UPDATE
                    special_offer
                SET
                    name = ?,
                    description = ?,
                    video_url = ?
                WHERE
                    special_offer_id = ?;`;

            this.db.execute(sql, [ data.name, data.description, data.videoURL, specialOfferId ])
                .then(async result => {
                    resolve(await this.getById(specialOfferId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    private async returnSpecialOfferImagePath(specialOfferId: number): Promise<string[]> {
        return new Promise<string[]>(async resolve => {
            const [ rows ] = await this.db.execute(
                `SELECT image_path FROM special_offer WHERE special_offer_id = ?;`,
                [ specialOfferId ]
            );

            if (!Array.isArray(rows) || rows.length === 0) return resolve([]);

            const fileToDelete = rows.map(row => row.image_path);      

            resolve(fileToDelete);
        });
    }

    private deleteSpecialOfferPhotoAndResizedVersion(filesToDelete: string[]) {
        try {
                const fileToDelete =  filesToDelete[0];
                fs.unlinkSync(fileToDelete);

                const pathParts = path.parse(fileToDelete);

                const directory = pathParts.dir;
                const filename  = pathParts.name;
                const extension = pathParts.ext;

                const resizedImagePath = directory + "/" +
                                             filename +
                                             Config.fileUpload.photos.resizes[0].sufix +
                                             extension;

                fs.unlinkSync(resizedImagePath);
            }
        catch (e) { }
    }

    private async fileToDelete (specialOfferId:number) {
        const file = await this.returnSpecialOfferImagePath(specialOfferId);
        this.deleteSpecialOfferPhotoAndResizedVersion(file);
    }

    public async delete(specialOfferId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(resolve => {
            this.fileToDelete(specialOfferId);
            const sql = "DELETE FROM special_offer WHERE special_offer_id = ?;";
            this.db.execute(sql, [specialOfferId])
                .then(async result => {
                    const deleteInfo: any = result[0];
                    const deletedRowCount: number = +(deleteInfo?.affectedRows);

                    if (deletedRowCount === 1) {
                        resolve({
                            errorCode: 0,
                            errorMessage: "One record deleted."
                        });
                    } else {
                        resolve({
                            errorCode: -1,
                            errorMessage: "This record could not be deleted because it does not exist."
                        });
                    }
                })
                .catch(error => {
                    if (error?.errno === 1451) {
                        resolve({
                            errorCode: -2,
                            errorMessage: "This record could not be deleted beucase it has animator(s)."
                        });
                        return;
                    }

                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
        });
    }
}

export default SpecialOfferService;