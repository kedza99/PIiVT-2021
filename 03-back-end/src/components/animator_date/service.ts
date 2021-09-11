import AnimatorModel from '../animator/model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddAnimatorDate} from './dto/AddAnimatorDate';
import BaseService from '../../common/BaseService';
import AnimatorDateModel from './model';

class AnimatorDateService extends BaseService<AnimatorDateModel>{

    protected async adaptModel(row: any): Promise<AnimatorDateModel> {
        const item: AnimatorDateModel = new AnimatorDateModel();

        item.animatorDateId = +(row?.animator_date_id);
        item.animatorId = +(row?.animator_id);
        item.reservedDate = row?.reserved_date;
        item.animator =  await this.services.animatorService.getById(item.animatorId) as AnimatorModel;
        
        return item;
    }

    public async getAllByAnimatorId(animatorId: number): Promise<AnimatorDateModel[]|IErrorResponse> {
        return await this.getAllByFieldNameFromTable(
            'animator_date',
            'animator_id',
            animatorId  
        );
    }


    public async getById(animatorDateId: number): Promise<AnimatorDateModel|null|IErrorResponse> {
        return await this.getByIdFromTable("animator_date", animatorDateId);
    }

    public async add(data: IAddAnimatorDate): Promise<AnimatorDateModel|IErrorResponse> {
        return new Promise<AnimatorDateModel|IErrorResponse>(async resolve => {
            const sql = `
                INSERT
                    animator_date
                SET
                    animator_id = ?,
                    reserved_date = ?;`;
                    
            this.db.execute(sql, [ data.animatorId, data.reservedDate])
                .then(async result => {
                    // const [ insertInfo ] = result;
                    const insertInfo: any = result[0];

                    const newAnimatorDateId: number = +(insertInfo?.insertId);
                    resolve(await this.getById(newAnimatorDateId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    public async delete(animatorDateId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(resolve => {
            const sql = "DELETE FROM animator_date WHERE animator_date_id = ?;";
            this.db.execute(sql, [animatorDateId])
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
                            errorMessage: "This record could not be deleted beucase it has reserved animator(s)"
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

export default AnimatorDateService;