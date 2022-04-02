import { FirebaseApi } from "../adapters/firebase";
import { Datasource } from "../model/datasource";
import { ApiMock } from "./api-mock";

export class Config {

    // static getDatasource(): Datasource {
    //     return new FirebaseApi();
    // }

    static getDatasource(): Datasource {
        return new ApiMock();
    }
}