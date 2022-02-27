import { FirebaseApi } from "../adapters/firebase";
import { Datasource } from "../model/datasource";

export class Config {

    static getDatasource(): Datasource {
        return new FirebaseApi();
    }
}