import SpecialOfferService from '../components/special_offer/service';
import AnimatorService from '../components/animator/service';
import AnimatorDateService from '../components/animator_date/service';
import ReservationService from '../components/reservation/service';


export default interface IServices {
    specialOfferService: SpecialOfferService;
    animatorService: AnimatorService;
    animatorDateService: AnimatorDateService;
    reservationService: ReservationService;
    
}
