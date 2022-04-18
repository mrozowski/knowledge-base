import { Document } from "./document"
export class CompoundDocument {

    constructor(
        readonly document: Document,
        readonly content: String
    ) { }

    // getContentFileId = () => {
    //     // let content = this.document.content;
    //     // content = content.replace(".md", "");
    //     // const lastIndexOfSlash = content.lastIndexOf("/");
    //     // return content.substring(lastIndexOfSlash);
    // }
}