import { SearchOption } from "../components/start/search-option";
import { Datasource } from "../model/datasource";
import { Issue } from "../model/issue";

export class ApiMock implements Datasource {

    getPageSize(): number {
        return 5;
    }
    search(searchOption: SearchOption): Promise<Issue[]> {
        return new Promise((resolve, reject) => {
            const result: Issue[] = new Array();
            result.push(new Issue("author", "Java", new Date(), "title", ["a", "b"], 1, "id", "some/desc", true));
            resolve(result);

        });
    }
    getIssues(): Promise<Issue[]> {
        return new Promise((resolve, reject) => {
            const result: Issue[] = new Array();
            result.push(new Issue("author", "Java", new Date(), "title", ["a", "b"], 1, "id", "some/desc", true));
            resolve(result);

        });
    }
    getNextIssues(): Promise<Issue[]> {
        return new Promise((resolve, reject) => {
            const result: Issue[] = new Array();
            result.push(new Issue("author", "Bash", new Date(), "title2", ["c", "b"], 2, "id", "some/desc2", true));
            resolve(result);

        });
    }
    getFileContent(filePath: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    storePicture(file: Blob, name: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    uploadMarkdown(text: string, id: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    createNewIssue(issue: Issue): Promise<void> {
        throw new Error("Method not implemented.");
    }

}