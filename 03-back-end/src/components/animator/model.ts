import SpecialOfferModel from '../special_offer/model';
class AnimatorModel {
    animatorId: number;
    name: string;
    surname: string;
    nickname: string;
    description: string;
    price:number;
    imagePath: string;
    specialOfferId: number;
    specialOffer?: SpecialOfferModel;
}

export default AnimatorModel;