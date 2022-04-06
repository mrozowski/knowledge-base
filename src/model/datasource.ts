import { SearchOption } from '../components/start/search-option';
import { Issue } from './issue'

export interface Datasource {
    getPageSize(): number;
    search(searchOption: SearchOption): Promise<Issue[]>
    getIssues(): Promise<Issue[]>;
    getIssue(id: string): Promise<Issue>;
    getNextIssues(searchOption?: SearchOption): Promise<Issue[]>;
    getFileContent(filePath: string): Promise<string>;
    storePicture(file: Blob, name: string): Promise<string>
    uploadMarkdown(text: string, id: string): Promise<string>;
    createNewIssue(issue: Issue): Promise<void>
    // create a new issue
    //login / logout
    // get issue by id
    // add sorting
}
