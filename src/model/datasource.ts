import { SearchOption } from './search-option';
import { Document } from './document'
import { UserAccount } from './user';

export interface Datasource {
    getPageSize(): number;
    search(searchOption: SearchOption): Promise<Document[]>
    getIssues(): Promise<Document[]>;
    getIssue(id: string): Promise<Document>;
    getNextIssues(searchOption?: SearchOption): Promise<Document[]>;
    getFileContent(filePath: string): Promise<string>;
    storePicture(file: Blob, name: string): Promise<string>
    uploadMarkdown(text: string, id: string): Promise<string>;
    createNewIssue(issue: Document): Promise<void>
    login(username: string, password: string): Promise<UserAccount>;
    logout(): Promise<void>;
    isLogin(): boolean;
    getCurrentUser(): UserAccount | undefined;
    //login / logout
}
