import AnimatorDateModel from '../animator_date/model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddReservation} from './dto/AddReservation';
import { IEditReservation} from './dto/EditReservation';
import BaseService from '../../common/BaseService';
import ReservationModel from './model';

class ReservationService extends BaseService<ReservationModel>{

    protected async adaptModel(row: any): Promise<ReservationModel> {
        const item: ReservationModel = new ReservationModel();

        item.reservationId = +(row?.reservation_id);
        item.clientName = row?.client_name;
        item.clientSurname = row?.client_surname;
        item.clientEmail = row?.client_email ;
        item.clientPhoneNumber = row?.client_phone_number;
        item.postalAddress = row?.postal_address;
        item.animatorDateId = +(row?.animator_date_id);
        item.createdAt = new Date(row?.created_at);
        item.animatorDate = await this.services.animatorDateService.getById(item.animatorDateId) as AnimatorDateModel;
        
        return item;
    }

    public async getAllByAnimatorDateId(animatorDateId: number): Promise<ReservationModel[]|IErrorResponse> {
        return await this.getAllByFieldNameFromTable(
            'reservation',
            'animator_date_id',
            animatorDateId  
        );
    }


    public async getById(reservationId: number): Promise<ReservationModel|null|IErrorResponse> {
        return await this.getByIdFromTable("reservation", reservationId);
    }

    public async edit(reservationId: number, data: IEditReservation): Promise<ReservationModel|IErrorResponse|null> {
        return new Promise<ReservationModel|IErrorResponse|null>(async resolve => {
            const currentReservation = await this.getById(reservationId);

            if (currentReservation === null) {
                return resolve(null);
            }

            this.db.execute(
                `UPDATE
                    reservation
                 SET
                 client_name = ?,
                 client_surname = ?,
                 client_email = ?,
                 client_phone_number = ?,
                 postal_address = ?

                 WHERE
                    reservation_id = ?;`,
                [
                    data.clientName,
                    data.clientSurname,
                    data.clientEmail,
                    data.clientPhoneNumber,
                    data.postalAddress,
                    reservationId
                ]
            )
            .then(async () => {
                resolve(await this.getById(reservationId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                });
            })
        });
    }

    public async add(data: IAddReservation): Promise<ReservationModel|IErrorResponse> {
        return new Promise<ReservationModel|IErrorResponse>(async resolve => {
            const sql = `
                INSERT
                    reservation
                SET
                    client_name = ?,
                    client_surname = ?,
                    client_email = ?,
                    client_phone_number = ?,
                    postal_address = ?,
                    animator_date_id = ?;`;
             
            this.db.execute(sql, [ data.clientName, data.clientSurname, data.clientEmail, data.clientPhoneNumber,
            data.postalAddress, data.animatorDateId])
                .then(async result => {
                    // const [ insertInfo ] = result;
                    const insertInfo: any = result[0];

                    const newReservationId: number = +(insertInfo?.insertId);
                    resolve(await this.getById(newReservationId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    public async delete(reservationId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(resolve => {
            const sql = "DELETE FROM reservation WHERE reservation_id = ?;";
            this.db.execute(sql, [reservationId])
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
                            errorMessage: "This record could not be deleted beucase it has animatorDate"
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

export default ReservationService;