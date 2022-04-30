/**
 * Find and return list of photos in the document uploaded to Firestore
 * @param content Content of document
 * @returns List of photo names that were found in the content
 */
export function findPhotosInContent(content: string): string[] {
    const firestoreImageLinkTemplate = "![image](https://firebasestorage";
    const symbol = "%2F";

    const result: string[] = []
    let indexOfLink = content.indexOf(firestoreImageLinkTemplate);

    while (indexOfLink != -1) {
        const endIndexOfLink = content.indexOf(")", indexOfLink);
        const photoLink = content.substring(indexOfLink + 9, endIndexOfLink)
        const fileNameIndexStart = photoLink.lastIndexOf(symbol) + symbol.length;
        const fileNameIndexEnd = photoLink.indexOf("?", fileNameIndexStart);
        const fileName = photoLink.substring(fileNameIndexStart, fileNameIndexEnd);

        result.push(fileName);
        indexOfLink = content.indexOf(firestoreImageLinkTemplate, endIndexOfLink);
    }

    return result;
}
