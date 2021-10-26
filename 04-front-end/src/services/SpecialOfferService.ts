
import api from '../api/api';
import SpecialOfferModel from '../../../03-back-end/src/components/special_offer/model';
import EventRegister from '../api/EventRegister';
export default class SpecialOfferService {
    public static getSpecialOffers(): Promise<SpecialOfferModel[]> {
        return new Promise<SpecialOfferModel[]>(resolve => {
            api("get", "/specialOffer", "administrator")
            .then(res => {
                if (res?.status !== "ok") {
                    if (res.status === "login") {
                        EventRegister.emit("AUTH_EVENT", "force_login");
                    }
                    return resolve([]);
                }

                resolve(res.data as SpecialOfferModel[]);
            });
        });
    }
}