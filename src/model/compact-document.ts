import { Document } from "./document"
export class CompactDocument {

    constructor(
        readonly document: Document,
        readonly content: Text
    ) { }

    getContentFileId = () => {
        let content = this.document.content;
        content = content.replace(".md", "");
        const lastIndexOfSlash = content.lastIndexOf("/");
        return content.substring(lastIndexOfSlash);
    }
}