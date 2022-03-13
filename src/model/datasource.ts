import { Issue } from './issue'

export interface Datasource {
    getIssues(): Promise<Issue[]>;
    getFileContent(filePath: string): Promise<string>;
    storePicture(file: Blob, name: string): Promise<string>
    // create a new issue
    //login / logout
    // get issue by id
    // add sorting
}
