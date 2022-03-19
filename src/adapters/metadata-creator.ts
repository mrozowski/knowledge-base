
export class Metadata {

    static create = (value: string): string[] => {
        return this.generateKeywords(value);
    }

    private static sentenceParser = (name: string): string[] => {
        const arrName: string[] = [];
        const words: string[] = name.split(' ');
        do {
            let curName = "";
            words.forEach(word => {
                curName += word + " ";
                arrName.push(curName.trim());
            });
            words.shift();
        } while (words.length > 0);

        return arrName;
    }

    private static generateKeywords = (value: string): string[] => {
        const nValue = value.toLowerCase();
        const fullTitle = this.sentenceParser(nValue);

        return [
            ...new Set([
                '',
                ...fullTitle
            ])
        ];
    }

}