import { SearchOption } from "../components/start/search-option";
import { Datasource } from "../model/datasource";
import { Issue } from "../model/issue";

export class ApiMock implements Datasource {

    private issues: Issue[] = [];
    private pageSize = 5;

    constructor() {
        console.log("constr");

        this.issues.push(new Issue("author", "Java", new Date(), "Some java issue", ["a", "b"], 1, "id", "some/desc", "Here is some short description of issie", true));
        this.issues.push(new Issue("author", "Bash", new Date(), "How to do that", ["Spring ", "tutorial ", "how-to"], 2, "id", "some/desc", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce varius blandit velit. Nunc nec lacus vel risus aliquet molestie. Vestibulum non ligula et quam aliquet tristique. Donec ornare dui metus, ut tincidunt erat bibendum in. Pellentesque egestas leo nibh, consequat vulputate leo porttitor sed.", true));
        this.issues.push(new Issue("author", "CSS", new Date(), "And How to do this to make it work and long so we can see if css work properly with very long titles", ["a", "b"], 3, "id", "some/desc", "Fusce varius blandit velit. Nunc nec lacus vel risus aliquet molestie.", true));
        this.issues.push(new Issue("author", "Other", new Date(), "Some other problem", ["a", "b"], 4, "id", "some/desc", "Vestibulum non ligula et quam aliquet tristique", true));
        this.issues.push(new Issue("author", "Servers", new Date(), "Some question", ["c", "b"], 5, "id", "some/desc2", "Donec ornare dui metus, ut tincidunt erat bibendum in. Pellentesque egestas leo nibh, consequat vulputate leo porttitor sed.", true));
        this.issues.push(new Issue("author", "Android", new Date(), "Spring jdbc", ["a", "b"], 6, "id", "some/desc", "Donec ornare dui metus, ut tincidunt erat bibendum in. Pellentesque egestas leo nibh, consequat vulputate leo porttitor sed.", true));
        this.issues.push(new Issue("author", "Web", new Date(), "Listener", ["a", "b"], 7, "id", "some/desc", "Donec ornare dui metus, ut tincidunt erat bibendum in. Pellentesque egestas leo nibh, consequat vulputate leo porttitor sed.", true));
        this.issues.push(new Issue("author", "Python", new Date(), "Generate random UUID", ["a", "b"], 8, "id", "some/desc", "Donec ornare dui metus, ut tincidunt erat bibendum in. Pellentesque egestas leo nibh, consequat vulputate leo porttitor sed.", true));
    }

    getPageSize(): number {
        return this.pageSize;
    }
    search(searchOption: SearchOption): Promise<Issue[]> {
        return new Promise((resolve, reject) => {
            const result: Issue[] = new Array();
            result.push(new Issue("author", "Java", new Date(), "Very important issue", ["a", "b"], 5, "id", "some/desc", "Donec ornare dui metus, ut tincidunt erat bibendum in. Pellentesque egestas leo nibh, consequat vulputate leo porttitor sed.", true));

            resolve(result);

        });
    }
    getIssues(): Promise<Issue[]> {
        return new Promise((resolve, reject) => {
            const result: Issue[] = new Array();
            resolve(this.issues.slice(0, this.pageSize));

        });
    }
    getNextIssues(): Promise<Issue[]> {
        return new Promise((resolve, reject) => {

            console.log(this.issues);

            resolve(this.issues.slice(this.pageSize));
        });
    }

    getFileContent(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let result: string = `
# here is some tipoc

1. ome
1. two

\`\`\` some code \`\`\`
            `;
            resolve(result);

        });
    }
    storePicture(file: Blob, name: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    uploadMarkdown(text: string, id: string): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve("some-path/to/file");
        });
    }
    createNewIssue(issue: Issue): Promise<void> {
        this.issues.push(issue);
        console.log(this.issues);

        return new Promise((resolve, reject) => {
            resolve();
        });
    }

}