// js/firebase.js
// Modern Firebase modular SDK setup (used with Vite)
// Config from Firebase Console (npm tab)

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  serverTimestamp,
  query,
  orderBy 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDqMA3nVUyTFywuRMv43NXvNasMiiJRJ-A",
  authDomain: "p4scigame.firebaseapp.com",
  projectId: "p4scigame",
  storageBucket: "p4scigame.firebasestorage.app",
  messagingSenderId: "937770158737",
  appId: "1:937770158737:web:1165453f5beba9d0fc0d30"
};

let db = null;

try {
  if (firebaseConfig.projectId && !firebaseConfig.projectId.includes('你嘅')) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
} catch (e) {
  console.warn("Firebase 初始化失敗：", e);
}

export function getDB() {
  return db;
}

export async function saveScore(data) {
  if (!db) throw new Error("Firebase 未設定");
  return addDoc(collection(db, 'scores'), {
    ...data,
    createdAt: serverTimestamp()
  });
}

export async function getAllScores() {
  if (!db) return [];
  const snap = await getDocs(collection(db, 'scores'));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export function subscribeScores(callback) {
  if (!db) return () => {};
  const q = query(collection(db, 'scores'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const scores = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(scores);
  });
}
