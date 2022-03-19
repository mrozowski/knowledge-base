import { SearchTitleOption } from '../components/start/searchOption';
import { Issue } from './issue'

export interface Datasource {
    search(searchOption: SearchTitleOption): Promise<Issue[]>;
    getIssues(): Promise<Issue[]>;
    getNextIssues(): Promise<Issue[]>;
    getFileContent(filePath: string): Promise<string>;
    storePicture(file: Blob, name: string): Promise<string>
    uploadMarkdown(text: string, id: string): Promise<string>;
    createNewIssue(issue: Issue): Promise<void>
    // create a new issue
    //login / logout
    // get issue by id
    // add sorting
}
