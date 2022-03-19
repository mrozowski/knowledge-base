import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, Firestore, doc, Timestamp, query, where, limit, orderBy, DocumentData, startAfter } from 'firebase/firestore/lite';
import { getStorage, FirebaseStorage, getBytes, getDownloadURL, getBlob, uploadBytes, StorageReference, ref, UploadResult, uploadString } from 'firebase/storage'
import { NoMoreIssuesHasBeenFound } from "../components/start/issues-exception";
import { SearchTitleOption } from "../components/start/searchOption";
import { Datasource } from '../model/datasource';
import { Issue } from '../model/issue';
import { Metadata } from "./metadata-creator";

const firebaseConfig = {
  apiKey: "AIzaSyAqq49xr6Ub6JURrCNIfdT04KXwqBkYgeU",
  authDomain: "knowladgedb.firebaseapp.com",
  projectId: "knowladgedb",
  storageBucket: "knowladgedb.appspot.com",
  messagingSenderId: "564186759564",
  appId: "1:564186759564:web:76200319c06cf4804c16a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const store = getStorage(app);


async function getCategory(db: Firestore) {
  const categoryCollection = collection(db, 'category');
  const categories = await getDocs(categoryCollection);
  return categories.docs.map(doc => doc.data());
}

export class FirebaseApi implements Datasource {

  constructor(
    private readonly pageSize: number = 3,
    private lastDoc?: DocumentData) { }

  async getIssues(): Promise<Issue[]> {
    const issueCollection = collection(db, 'issues');
    let customQuery = query(issueCollection, orderBy("created_at", "desc"), limit(this.pageSize));

    const issues = await getDocs(customQuery);
    this.lastDoc = issues.docs[issues.docs.length - 1];

    const response = Array();

    issues.forEach(issue => {
      response.push(FirebaseApi.issueMapper(issue.data()))
    });

    return response;
  }

  async getNextIssues(): Promise<Issue[]> {
    console.log(this.lastDoc);

    if (this.lastDoc) {
      const issueCollection = collection(db, 'issues');
      let customQuery = query(issueCollection, orderBy("created_at", "desc"), startAfter(this.lastDoc), limit(this.pageSize));
      const issues = await getDocs(customQuery);
      this.lastDoc = issues.docs[issues.docs.length - 1];
      const response = Array();

      issues.forEach(issue => {
        response.push(FirebaseApi.issueMapper(issue.data()))
      });

      if (response.length == 0) {
        throw new NoMoreIssuesHasBeenFound();
      }

      return response;
    }
    return []
  }

  async getFileContent(filePath: string): Promise<string> {
    let reference: StorageReference = ref(store, filePath);
    let result: Blob = await getBlob(reference);
    return result.text();
  }

  async storePicture(file: Blob, name: string): Promise<string> {
    let reference: StorageReference = ref(store, `issues/pictures/${name}`);
    let upload = uploadBytes(reference, file);
    return getDownloadURL((await upload).ref);
  }

  async uploadMarkdown(text: string, id: string): Promise<string> {
    let reference: StorageReference = ref(store, `issues/markdowns/${id}.md`);
    let upload = uploadString(reference, text);
    return (await upload).ref.fullPath;
  }

  async createNewIssue(issue: Issue): Promise<void> {
    return setDoc(doc(db, 'issues', issue.id), {
      author: issue.author,
      category: issue.category,
      created_at: Timestamp.fromDate(issue.createdAt),
      title: issue.title,
      tags: issue.tags,
      id: issue.id,
      description: issue.description,
      metadata: Metadata.create(issue.title),
      public: issue.isPublic,
      views: 0
    });
  }

  async search(searchOption: SearchTitleOption): Promise<Issue[]> {
    const issueCollection = collection(db, 'issues');
    const queryForTitle = query(issueCollection, where("metadata", "array-contains", searchOption.title));
    const querySnapshot = await getDocs(queryForTitle);
    const response = Array();
    querySnapshot.forEach((issues) => {
      response.push(FirebaseApi.issueMapper(issues.data()))
    });
    return response;
  }

  private static issueMapper(json) {
    return new Issue(
      json.author,
      json.category,
      new Date(json.created_at.seconds * 1000),
      json.title,
      json.tags,
      json.views,
      json.id,
      json.description,
      json.public
    );
  }
}


