import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, Firestore, doc, Timestamp, query, where, limit, orderBy, DocumentData, startAfter, OrderByDirection, WhereFilterOp, QueryConstraint, Query } from 'firebase/firestore/lite';
import { getStorage, FirebaseStorage, getBytes, getDownloadURL, getBlob, uploadBytes, StorageReference, ref, UploadResult, uploadString } from 'firebase/storage'
import { NoMoreIssuesHasBeenFound } from "../components/start/issues-exception";
import { DateOption, OrderBy, SearchOption } from "../components/start/search-option";
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

class FirebaseOrder {
  constructor(
    readonly field: string,
    readonly order: OrderByDirection) { };
}

export class FirebaseApi implements Datasource {

  constructor(
    public readonly pageSize: number = 3,
    private lastDoc?: DocumentData) { }

  getPageSize(): number {
    return this.pageSize;
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
      content: issue.content,
      description: issue.description,
      metadata: Metadata.create(issue.title),
      public: issue.isPublic,
      views: 0
    });
  }

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

  async getNextIssues(searchOption: SearchOption): Promise<Issue[]> {
    if (this.lastDoc) {
      const issueCollection = collection(db, 'issues');
      let customQuery: any;
      if (searchOption.isDefault()) {
        customQuery = query(issueCollection, orderBy("created_at", "desc"), startAfter(this.lastDoc), limit(this.pageSize));
      } else {
        const filters: QueryConstraint[] = this.createQueryConstraints(searchOption);
        customQuery = query(issueCollection, ...filters, startAfter(this.lastDoc), limit(this.pageSize));
      }

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

  async search(searchOption: SearchOption): Promise<Issue[]> {
    const issueCollection = collection(db, 'issues');

    const filters: QueryConstraint[] = this.createQueryConstraints(searchOption);

    const firebaseQuery = query(issueCollection, ...filters, limit(this.pageSize));
    return this.getQueryResponse(firebaseQuery);
  }

  private createQueryConstraints(searchOption: SearchOption): QueryConstraint[] {
    const firebaseOrder = this.toFirebaseOrder(searchOption.order);
    let filters: QueryConstraint[] = [];

    if (searchOption.isDate()) {
      filters.push(where("created_at", this.toFirebaseFilterSymbol(searchOption.date!.option), Timestamp.fromDate(searchOption.date!.date)));
      if (firebaseOrder.field != "created_at")
        filters.push(orderBy("created_at", "desc"));
    }
    if (searchOption.isCategories()) {
      filters.push(where("category", "in", searchOption.categories))
    }
    if (searchOption.isTags() && searchOption.isTitle()) {
      //Due to limitation of firebase we cannot use array-contains-any and array-contains in a single query :(
      filters.push(where("tags", "in", searchOption.tags[0]))
    } else if (searchOption.isTags() && !searchOption.isTitle()) {
      filters.push(where("tags", "array-contains-any", searchOption.tags))
    }
    if (searchOption.isTitle()) {
      filters.push(where("metadata", "array-contains", searchOption.title));
    }

    filters.push(orderBy(firebaseOrder.field, firebaseOrder.order));
    return filters;
  }

  private async getQueryResponse(query: Query) {
    const querySnapshot = await getDocs(query);
    this.lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    console.log("download docs");

    const response = Array();
    querySnapshot.forEach((issues) => {
      response.push(FirebaseApi.issueMapper(issues.data()))
    });
    return response;
  }

  private toFirebaseOrder(order: OrderBy): FirebaseOrder {
    switch (order) {
      case "Date: Newest": return new FirebaseOrder("created_at", "desc");
      case "Date: Oldest": return new FirebaseOrder("created_at", "asc");
      case "Title: A..Z": return new FirebaseOrder("title", "asc");
      case "Title: Z..A": return new FirebaseOrder("title", "desc");
      case "Popularity: Highest": return new FirebaseOrder("views", "desc");
    }
  }

  private toFirebaseFilterSymbol(option: DateOption): WhereFilterOp {
    return option === DateOption.NEWER ? ">=" : "<=";
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
      json.content,
      json.description,
      json.public
    );
  }
}




