import { Issue } from './issue'

export interface Datasource {
    getIssues(): Promise<Issue[]>;
    // create a new issue
    //login / logout
    // get issue by id
    // add sorting
}
