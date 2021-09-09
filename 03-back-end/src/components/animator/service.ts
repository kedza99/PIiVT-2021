import AnimatorModel from './model';
import * as mysql2 from 'mysql2/promise'
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddAnimator,} from './dto/AddAnimator';
import BaseService from '../../common/BaseService';
import SpecialOfferModel from '../special_offer/model';

class AnimatorService extends BaseService<AnimatorModel>{

    protected async adaptModel(row: any): Promise<AnimatorModel> {
        const item: AnimatorModel = new AnimatorModel();

        item.animatorId = +(row?.animator_id);
        item.name = row?.name;
        item.surname = row?.surname;
        item.nickname = row?.nickname;
        item.description = row?.description;
        item.price = row?.price;
        item.imagePath = row?.image_path;
        item.specialOfferId = row?.special_offer_id;
        item.specialOffer = await this.services.specialOfferService.getById(item.specialOfferId) as SpecialOfferModel;
        
        return item;
    }

    public async getAll(): Promise<AnimatorModel[]|IErrorResponse> {
        return await this.getAllFromTable(
            'animator',
        );
    }

    public async getAllBySpecialOfferId(specialOfferId: number): Promise<AnimatorModel[]|IErrorResponse> {
        return await this.getAllByFieldNameFromTable(
            'animator',
            'special_offer_id',
            specialOfferId   
        );
    }

    public async getAllByPrice(price: number): Promise<AnimatorModel[]|IErrorResponse> {
        return await this.getAllByFieldNameFromTable(
            'animator',
            'price',
            price   
        );
    }

    public async getById(animatorId: number): Promise<AnimatorModel|null|IErrorResponse> {
        return await this.getByIdFromTable("animator", animatorId);
    }

    public async add(data: IAddAnimator, uploadedPhoto: string): Promise<AnimatorModel|IErrorResponse> {
        return new Promise<AnimatorModel|IErrorResponse>(async resolve => {
            const sql = `
                INSERT
                    animator
                SET
                    name = ?,
                    surname = ?,
                    nickname = ?,
                    description = ?,
                    price = ?,
                    image_path = ?,
                    special_offer_id = ?;`;
                    
            this.db.execute(sql, [ data.name, data.surname, data.nickname, data.description,
                 data.price, uploadedPhoto, data.specialOfferId ])
                .then(async result => {
                    // const [ insertInfo ] = result;
                    const insertInfo: any = result[0];

                    const newAnimatorId: number = +(insertInfo?.insertId);
                    resolve(await this.getById(newAnimatorId));
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
        animatorId: number,
        data: IAddAnimator
        
    ): Promise<AnimatorModel|IErrorResponse|null> {
        const result = await this.getById(animatorId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof AnimatorModel)) {
            return result;
        }

        return new Promise<AnimatorModel|IErrorResponse>(async resolve => {
            const sql = `
                UPDATE
                    animator
                SET
                name = ?,
                surname = ?,
                nickname = ?,
                description = ?,
                price = ?,
                special_offer_id = ?

                WHERE
                    animator_id = ?;`;

            this.db.execute(sql, [ data.name, data.surname, data.nickname, data.description,
                 data.price, data.specialOfferId, animatorId ])
                .then(async result => {
                    resolve(await this.getById(animatorId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    public async delete(animatorId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(resolve => {
            const sql = "DELETE FROM animator WHERE animator_id = ?;";
            this.db.execute(sql, [animatorId])
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
                            errorMessage: "This record could not be deleted beucase it has reserved date(s)"
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

export default AnimatorService;