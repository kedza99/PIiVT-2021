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

    public async deleteReservation(reservationId: number): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            const sql = "DELETE FROM reservation WHERE reservation_id = ?;";
            this.db.execute(sql, [reservationId])
                .then(() => resolve(true))
                .catch(() => resolve(false));
            });
    }

    public async deleteAnimatorDate(animatorDateId: number): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            const sql = "DELETE FROM animator_date WHERE animator_date_id = ?;";
            this.db.execute(sql, [animatorDateId])
                .then(() => resolve(true))
                .catch(() => resolve(false));
            });
    }

    public async delete(reservationId: number): Promise<IErrorResponse|null> {
        return new Promise<IErrorResponse>(async resolve => {

            const reservation = await this.getById(reservationId) as ReservationModel;
            const animatorDateId = +(reservation.animatorDateId);

            this.db.beginTransaction()
                .then(async () => {
                    if (await this.deleteReservation(reservationId)) return;
                    throw { errno: -1003, sqlMessage: "Could not delete reservation.", };
                })
                .then(async () => {
                    if (await this.deleteAnimatorDate(animatorDateId)) return;
                    throw { errno: -1002, sqlMessage: "Could not delete animatorDate.", };
                })
                .then(async () => {
                    await this.db.commit();
                })
                .then(() => {
                    resolve({
                        errorCode: 0,
                        errorMessage: "Reservation deleted!",
                    });
                })
                .catch(async error => {
                    await this.db.rollback();
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }
}

export default ReservationService;