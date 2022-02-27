import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, Firestore } from 'firebase/firestore/lite';
import { Datasource } from '../model/datasource';
import { Issue } from '../model/issue';

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


async function getCategory(db: Firestore) {
  const categoryCollection = collection(db, 'category');
  const categories = await getDocs(categoryCollection);
  return categories.docs.map(doc => doc.data());
}

async function getIssues(db: Firestore) {
  const issueCollection = collection(db, 'issues');
  const issues = await getDocs(issueCollection);
  return issues.docs.map(doc => doc.data());
}

export class FirebaseApi implements Datasource {

  async getIssues(): Promise<Issue[]> {
    const issues = await getIssues(db);
    const response = Array();


    issues.forEach(issue => {

      response.push(new Issue(
        issue.author,
        issue.category,
        new Date(issue.created_at.seconds * 1000),
        issue.title,
        issue.tags,
        issue.views,
        issue.id,
        issue.description,
        issue.solution,
        issue.public
      ));
    });

    return response;
  }

}

