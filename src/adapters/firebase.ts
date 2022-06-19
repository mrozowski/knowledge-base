import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, deleteDoc, doc, Timestamp, query, where, limit, orderBy, DocumentData, startAfter, OrderByDirection, WhereFilterOp, QueryConstraint, Query, updateDoc, increment, getDoc } from 'firebase/firestore/lite';
import { getStorage, getDownloadURL, getBlob, uploadBytes, StorageReference, ref, uploadString, deleteObject } from 'firebase/storage'
import { browserLocalPersistence, getAuth, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { DocumentNotFoundError, NoMoreDocsHasBeenFound } from "../pages/home/document-exception";
import { DateOption, OrderBy, SearchOption } from "../model/search-option";
import { Datasource } from '../model/datasource';
import { Document } from '../model/document';
import { Metadata } from "./metadata-creator";
import { UserAccount } from "../model/user";
import { Storage } from "./localstorage";

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
const auth = getAuth();

auth.onAuthStateChanged(function (user) {
  if (user) {
    Storage.setAsLoggedIn(user.email!);
  } else {
    Storage.setAsLoggedOut();
  }
});

class FirebaseOrder {
  constructor(
    readonly field: string,
    readonly order: OrderByDirection) { };
}

export class FirebaseApi implements Datasource {


  constructor(
    public readonly pageSize: number = 7,
    private lastDoc?: DocumentData) { }

  async incrementViews(id: string): Promise<void> {
    const reference = doc(db, "issues", id);

    updateDoc(reference, { views: increment(1) });
  }


  getCurrentUser(): UserAccount | undefined {
    const user = auth.currentUser;
    if (user)
      return new UserAccount(user.email!, user.displayName!, user.uid)
    return undefined;
  }

  async logout(): Promise<void> {
    return auth.signOut();
  }

  async login(email: string, password: string): Promise<UserAccount> {
    const user = setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in 
            const _user = userCredential.user;
            return new UserAccount(_user.email!, _user.displayName!, _user.uid);
          })
          .catch((error) => {
            throw new Error(error);
          });
      })

    return new UserAccount((await user).email, (await user).username, (await user).id);
  }

  isLogin(): boolean {
    return Storage.getLoggedInUser() != null;
  }


  getPageSize(): number {
    return this.pageSize;
  }

  async getIssue(id: string): Promise<Document> {
    const reference = doc(db, "issues", id);
    const issues = await getDoc(reference);

    if (issues.data()) {
      return FirebaseApi.issueMapper(issues.data());
    }
    throw new DocumentNotFoundError(id);
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

  async removePictures(names: string[]): Promise<void> {
    if (names.length >= 500) throw Error("Cannot delete more than 500 files at once");
    const a = names.map(name => {
      let reference: StorageReference = ref(store, `issues/pictures/${name}`);
      return deleteObject(reference);
    });

    return a[0];
  }


  async uploadMarkdown(text: string, id: string): Promise<string> {
    let reference: StorageReference = ref(store, `issues/markdowns/${id}.md`);
    let upload = uploadString(reference, text);
    return (await upload).ref.fullPath;
  }

  async modifyDocument(document: Document): Promise<void> {
    const reference = doc(db, "issues", document.id);
    updateDoc(reference, {
      category: document.category,
      title: document.title,
      tags: document.tags,
      modified_at: Timestamp.fromDate(document.modifiedAt),
      description: document.description,
      metadata: Metadata.create(document.title),
      public: document.isPublic,
    })
  }

  async removeDocument(id: string): Promise<void> {
    const reference = doc(db, "issues", id);
    deleteDoc(reference);
  }

  async createNewIssue(document: Document): Promise<void> {
    const createTime = Timestamp.fromDate(document.createdAt);
    return setDoc(doc(db, 'issues', document.id), {
      author: document.author,
      category: document.category,
      created_at: createTime,
      modified_at: createTime,
      title: document.title,
      tags: document.tags,
      id: document.id,
      content: document.content,
      description: document.description,
      metadata: Metadata.create(document.title),
      public: document.isPublic,
      views: 0,
      author_id: auth.currentUser?.uid
    });
  }

  async getIssues(): Promise<Document[]> {
    const issueCollection = collection(db, 'issues');
    let customQuery;

    if (this.isLogin()) {
      customQuery = query(issueCollection, orderBy("created_at", "desc"), limit(this.pageSize));
    } else {
      customQuery = query(issueCollection, orderBy("created_at", "desc"), where("public", "==", true), limit(this.pageSize));
    }

    const issues = await getDocs(customQuery);
    this.lastDoc = issues.docs[issues.docs.length - 1];

    const response = Array();

    issues.forEach(issue => {
      response.push(FirebaseApi.issueMapper(issue.data()))
    });

    return response;
  }

  async getNextIssues(searchOption: SearchOption): Promise<Document[]> {
    if (this.lastDoc) {
      const issueCollection = collection(db, 'issues');
      let customQuery: any;
      if (searchOption.isDefault()) {
        if (searchOption.isPrivateOnly() && this.isLogin()) {

        } else {
          customQuery = query(issueCollection, where("public", "==", true), orderBy("created_at", "desc"), startAfter(this.lastDoc), limit(this.pageSize));
        }

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
        throw new NoMoreDocsHasBeenFound();
      }

      return response;
    }
    return []
  }

  async search(searchOption: SearchOption): Promise<Document[]> {
    const issueCollection = collection(db, 'issues');

    const filters: QueryConstraint[] = this.createQueryConstraints(searchOption);

    const firebaseQuery = query(issueCollection, ...filters, limit(this.pageSize));
    return this.getQueryResponse(firebaseQuery);
  }

  private createQueryConstraints(searchOption: SearchOption): QueryConstraint[] {
    const firebaseOrder = this.toFirebaseOrder(searchOption.order);
    let filters: QueryConstraint[] = [];


    if (searchOption.isPrivateOnly() && this.isLogin()) {
      filters.push(where("public", "==", false), where("author_id", "==", this.getCurrentUser()?.id));
    } else {
      filters.push(where("public", "==", true));
    }

    if (searchOption.isDate()) {
      filters.push(where("created_at", this.toFirebaseFilterSymbol(searchOption.date!.option), Timestamp.fromDate(searchOption.date!.date)));
      if (firebaseOrder.field != "created_at")
        filters.push(orderBy("created_at", "desc"));
    }
    if (searchOption.isCategories() && !searchOption.isTags()) {
      // Again Firebase limitation doesnt let use two 'in' filters. Categories filter cannot be used together with tags
      filters.push(where("category", "in", searchOption.categories))
    }
    if (searchOption.isTags() && searchOption.isTitle()) {
      //Due to limitation of firebase we cannot use array-contains-any and array-contains in a single query :(
      filters.push(where("tags", "in", searchOption.tags))
    } else if (searchOption.isTags() && (!searchOption.isTitle() || !searchOption.isCategories())) {
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

    const response = Array();
    querySnapshot.forEach((issues) => {
      response.push(FirebaseApi.issueMapper(issues.data()))
    });

    if (response.length === 0) throw new NoMoreDocsHasBeenFound();
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
    return new Document(
      json.author,
      json.author_id,
      json.category,
      new Date(json.created_at.seconds * 1000),
      new Date(json.modified_at.seconds * 1000),
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
