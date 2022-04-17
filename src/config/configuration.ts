import { FirebaseApi } from "../adapters/firebase";
import { Datasource } from "../model/datasource";
import { ApiMock } from "./api-mock";


const KDatasource: Datasource = new FirebaseApi();
export default KDatasource;

// const KDatasource: Datasource = new ApiMock();
// export default KDatasource;