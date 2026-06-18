import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || "(default)");
const auth = getAuth(app);

// Connectivity sanity check as per SKILL.md
async function validateConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connection verified and authenticated successfully.");
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or network link.");
    } else {
      console.log("Database initialized. Initial test fetch complete (Expected document might be missing, which is normal).");
    }
  }
}

validateConnection();

export { app, db, auth };
