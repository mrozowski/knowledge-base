import { SearchOption } from "../model/search-option";
import { Datasource } from "../model/datasource";
import { Document } from "../model/document";
import { UserAccount } from "../model/user";

export class ApiMock implements Datasource {

    private issues: Document[] = [];
    private pageSize = 5;
    private isLoggedIn: boolean = false;
    private user?: UserAccount;

    constructor() {
        this.login("", "");
        this.issues.push(new Document("author", "userId", "Java", new Date(), new Date(), "Some java issue", ["a", "b"], 1, "5e479fb3-4852-4b7e-ad39-fdbc5c68e969", "some/desc", "Here is some short description of issie", true));
        this.issues.push(new Document("author", "userId2", "Bash", new Date(), new Date(), "How to do that", ["Spring", "tutorial", "how-to"], 2, "e64a6208-ab7c-4958-873e-1e0126c7c684", "some/desc", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce varius blandit velit. Nunc nec lacus vel risus aliquet molestie. Vestibulum non ligula et quam aliquet tristique. Donec ornare dui metus, ut tincidunt erat bibendum in. Pellentesque egestas leo nibh, consequat vulputate leo porttitor sed.", true));
        this.issues.push(new Document("author", "userId2", "CSS", new Date(), new Date(), "And How to do this to make it work and long so we can see if css work properly with very long titles", ["a", "b"], 3, "6faa8dc9-f439-4b83-a019-e882e046c40d", "some/desc", "Fusce varius blandit velit. Nunc nec lacus vel risus aliquet molestie.", true));
        this.issues.push(new Document("author", "userId", "Other", new Date(), new Date(), "Some other problem", ["a", "b"], 4, "9d3b2b8d-5c24-4cc4-89c6-145fbfefa7dd", "some/desc", "Vestibulum non ligula et quam aliquet tristique", true));
        this.issues.push(new Document("author", "userId", "Servers", new Date(), new Date(), "Some question", ["c", "b"], 5, "f06f2f60-a97b-4675-baf7-762aecc6176d", "some/desc2", "Donec ornare dui metus, ut tincidunt erat bibendum in. Pellentesque egestas leo nibh, consequat vulputate leo porttitor sed.", true));
        this.issues.push(new Document("author", "userId", "Android", new Date(), new Date(), "Spring jdbc", ["a", "b"], 6, "03812038-ce9e-4f4f-8b82-4fba68ab990f", "some/desc", "Donec ornare dui metus, ut tincidunt erat bibendum in. Pellentesque egestas leo nibh, consequat vulputate leo porttitor sed.", true));
        this.issues.push(new Document("author", "userId", "Web", new Date(), new Date(), "Listener", ["a", "b"], 7, "8f9c01d1-2edf-4ab9-a6d9-688a85b7130e", "some/desc", "Donec ornare dui metus, ut tincidunt erat bibendum in. Pellentesque egestas leo nibh, consequat vulputate leo porttitor sed.", true));
        this.issues.push(new Document("author", "userId", "Python", new Date(), new Date(), "Generate random UUID", ["a", "b"], 8, "a94bd733-ec72-4f54-b5ce-906181753866", "some/desc", "Donec ornare dui metus, ut tincidunt erat bibendum in. Pellentesque egestas leo nibh, consequat vulputate leo porttitor sed.", true));
    }

    async removeDocument(id: string): Promise<void> {
        console.log("document deleted");

    }

    async removePictures(names: string[]): Promise<void> {
        console.log("Files: " + names + " deleted");
        //throw new Error();
    }

    async modifyDocument(document: Document): Promise<void> {
        const docIndex = this.issues.findIndex(e => document.id === e.id);
        this.issues.splice(docIndex, 1);
        this.issues.push(document);
    }

    getCurrentUser(): UserAccount | undefined {
        return this.user;
    }

    async logout(): Promise<void> {
        this.isLoggedIn = false;
        return;
    }

    isLogin(): boolean {
        return this.isLoggedIn;
    }

    async login(username: string, password: string): Promise<UserAccount> {
        this.isLoggedIn = true;
        this.user = new UserAccount("testAccont@gmail.com", "author", "userId");
        return this.user;
    }

    getPageSize(): number {
        return this.pageSize;
    }
    search(searchOption: SearchOption): Promise<Document[]> {
        return new Promise((resolve, reject) => {
            const result: Document[] = new Array();
            result.push(new Document("author", "userId", "Java", new Date(), new Date(), "Very important issue", ["a", "b"], 5, "886c4a6d-63e1-44c2-8327-a5d958eeee5d", "some/desc", "Donec ornare dui metus, ut tincidunt erat bibendum in. Pellentesque egestas leo nibh, consequat vulputate leo porttitor sed.", true));
            setTimeout(() => {
                resolve(result);
            }, 6000);

        });
    }
    getIssues(): Promise<Document[]> {

        return new Promise((resolve, reject) => {
            const result: Document[] = new Array();
            setTimeout(() => {
                resolve(this.issues.slice(0, this.pageSize));
            }, 3000);


        });
    }


    getIssue(id: string): Promise<Document> {
        return new Promise((resolve, reject) => {
            const result = this.issues.filter(e => e.id === id);
            if (result.length > 0) {
                setTimeout(() => {
                    resolve(result[0]);
                }, 5000);

            } else {
                throw new Error("Not Found");
            }
        });
    }

    getNextIssues(): Promise<Document[]> {
        return new Promise((resolve, reject) => {
            console.log(this.issues.slice(this.pageSize));

            resolve(this.issues.slice(this.pageSize));
        });
    }

    getFileContent(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let result: string = `
# Description

1. ome
1. two

\`![image](https://firebasestorage.googleapis.com/v0/b/knowladgedb.appspot.com/o/issues%2Fpictures%2F1651303003698.png?alt=media&token=d9a5d646-4ec2-43e2-a99b-f3cfadc69b0d)\`

\` Hello \`

# Solution

\`![image](https://firebasestorage.googleapis.com/v0/b/knowladgedb.appspot.com/o/issues%2Fpictures%2F1651303003123.png?alt=media&token=d9a5d646-4ec2-43e2-a99b-f3cfadc69b0d)\`
\`\`\` some code \`\`\`
            `;
            resolve(result);

        });
    }
    storePicture(file: Blob, name: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    uploadMarkdown(text: string, id: string): Promise<string> {
        console.log("markdown uploaded");

        return new Promise((resolve, reject) => {
            resolve("some-path/to/file/" + id + ".md");
        });
    }
    createNewIssue(issue: Document): Promise<void> {
        this.issues.push(issue);
        console.log(this.issues);
        return new Promise((resolve, reject) => {
            reject();
        });
    }

}