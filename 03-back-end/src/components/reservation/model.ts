
import AnimatorDateModel from '../animator_date/model';
class ReservationModel {
    reservationId: number;
    clientName: string;
    clientSurname: string;
    clientEmail: string;
    clientPhoneNumber: string;
    postalAddress: string;
    animatorDateId: number;
    createdAt: Date;
    animatorDate?: AnimatorDateModel;
}

export default ReservationModel;