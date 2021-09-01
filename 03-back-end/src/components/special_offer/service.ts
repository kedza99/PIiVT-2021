import SpecialOfferModel from './model';
import * as mysql2 from 'mysql2/promise'

class SpecialOfferService{
    private db: mysql2.Connection;

    constructor(db: mysql2.Connection) {
        this.db= db;
    }
    protected async adaptModel(row: any): Promise<SpecialOfferModel> {
        const item: SpecialOfferModel = new SpecialOfferModel();

        item.specialOfferId = +(row?.special_offer_id);
        item.name = row?.name;
        item.description = row?.description;
        item.videoURL = row?.video_url;
        item.imagePath = row?.image_path;

        return item;
    }

    public async getAll(): Promise<SpecialOfferModel[]> {
        const lista: SpecialOfferModel[] = [];

        const sql: string = "SELECT * FROM special_offer";
        const [rows, columns] = await this.db.execute(sql);

        if(Array.isArray(rows)){
            for(const row of rows){
                lista.push(
                    await this.adaptModel(
                        row
                    )
                )
            }
        }
        return lista;
    }
}

export default SpecialOfferService;